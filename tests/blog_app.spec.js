const { test, expect, describe, beforeEach } = require('@playwright/test')
const { wipeDB, loginWith, createUser, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await wipeDB(request)
    await createUser(request, 'Test User', 'user', 'password')
    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    const usernameField = page.getByLabel('Username')
    const passwordField = page.getByLabel('Password')
    const loginButton = page.getByRole('button', { name: 'Login' })

    await expect(usernameField).toBeVisible()
    await expect(passwordField).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  test('Login successfully with proper credentials', async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await expect(page.getByText('Hello, Test User!')).toBeVisible()
  })

  test('Fails login with improper credentials', async ({ page }) => {
    await loginWith(page, 'user', 'wrong')

    await expect(page.getByText('Failed to login!')).toBeVisible()
  })

  test("Can successfully create a blog once logged in", async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')
    await expect(page.getByText('Title Author')).toBeVisible()
  })

  test("The like button functionality works for an existing blog", async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')

    const viewButton = page.getByRole('button', { name: 'view' })
    await viewButton.click()

    const likeButton = page.getByRole('button', { name: 'like' })
    await likeButton.click()

    await expect(page.getByText('Likes: 1')).toBeVisible()
  })

  test('Users who create blogs, can delete their own blogs', async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')

    const viewButton = page.getByRole('button', { name: 'view' })
    await viewButton.click()

    const removeButton = page.getByRole('button', { name: 'remove' })
    page.on('dialog', dialog => dialog.accept())
    await removeButton.click()
    await expect(page.getByText('Title Author')).not.toBeVisible()
  })
})