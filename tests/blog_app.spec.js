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

  test('Login functionality tested', async ({ page }) => {
    //We need to do two things here; 
    // We need to try to login with a known existing user within the test DB
    // Really it is like we need to first create a user which we will know...
    // Then we need to find the login fields, fill them with known password/username, and see if we succeed

    //Secondly, we need to try and login with information we know is false, and ensure we failed to login

  })
})