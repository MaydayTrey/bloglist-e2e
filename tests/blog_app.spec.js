// bloglist-e2e/tests/blog_app.spec.js
const { test, expect, describe, beforeEach } = require('@playwright/test')
const { wipeDB, loginWith, createUser, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await wipeDB(request)
    await createUser(request, 'Test User', 'user', 'password')
    await createUser(request, 'Second User', 'secondUser', 'password')
    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  test('login fails with incorrect credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('Username').fill('user')
    await page.getByLabel('Password').fill('wrong')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('Failed to login!')).toBeVisible()
    await expect(page.getByText('Test User logged in')).not.toBeVisible()
  })

  test('a logged-in user can create a blog', async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')

    await expect(page.getByRole('link', { name: 'Title Author' })).toBeVisible()
  })

  test('a logged-in user can like a blog', async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')

    await page.getByRole('link', { name: 'Title Author' }).click()
    await page.getByRole('button', { name: 'like' }).click()

    await expect(page.getByText('Likes: 1')).toBeVisible()
  })

  test('a logged-in user can delete their own blog', async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')

    await page.getByRole('link', { name: 'Title Author' }).click()

    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'remove' }).click()

    await expect(page.getByRole('link', { name: 'Title Author' })).not.toBeVisible()
  })

  test('only the creator sees the remove button', async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')

    await page.getByRole('button', { name: 'Logout' }).click()
    await page.goto('http://localhost:5173')

    await loginWith(page, 'secondUser', 'password')
    await page.getByRole('link', { name: 'Title Author' }).click()

    await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
  })
})