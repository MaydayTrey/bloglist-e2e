const { test, expect, describe, beforeEach } = require('@playwright/test')
const { wipeDB, loginWith, createUser} = require('./helper')

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
    const createNewBlogButton = page.getByRole('button', { name: 'Create a new blog'})
    await createNewBlogButton.click()

    const authorField = page.getByLabel('Author')
    const titleField = page.getByLabel('Title')
    const urlField = page.getByLabel('URL')
    
    await authorField.fill('Author')
    await titleField.fill('Title')
    await urlField.fill('URL')

    const createBlog = page.getByRole('button', { name: 'Create blog' })
    await createBlog.click()

    await expect(page.getByText('Title Author')).toBeVisible()
  })
})