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
})