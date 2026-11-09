const { test, expect, describe, beforeEach } = require('@playwright/test')
const { wipeDB, loginWith, createUser, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await wipeDB(request)
    await createUser(request, 'Test User', 'user', 'password')
    await createUser(request, 'Second User', 'secondUser', 'password')
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
  
  test("Only the user which created the blog has the option to remove the blog", async ({ page }) => {
    await loginWith(page, 'user', 'password')
    await createBlog(page, 'Author', 'Title', 'url')
    const logoutButton = page.getByRole('button', { name: 'Test User, click here to Logout.' })
    await logoutButton.click()
    await page.goto('http://localhost:5173')

    await loginWith(page, 'secondUser', 'password')

    const viewButton = page.getByRole('button', { name: 'view' })
    await viewButton.click()

    await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
  })

  test('Blogs are ordered by likes, most liked first', async ({ page }) => {
  await loginWith(page, 'user', 'password')

  await createBlog(page, 'Author One', 'Least liked', 'url1')
  await createBlog(page, 'Author Two', 'Most liked', 'url2')
  await createBlog(page, 'Author Three', 'Middle liked', 'url3')

  // Like "Most liked" twice
  const mostLiked = page.locator('.blog').filter({ hasText: 'Most liked' })
  await mostLiked.getByRole('button', { name: 'view' }).click()
  await mostLiked.getByRole('button', { name: 'like' }).click()
  await expect(mostLiked.getByText('Likes: 1')).toBeVisible()
  await mostLiked.getByRole('button', { name: 'like' }).click()
  await expect(mostLiked.getByText('Likes: 2')).toBeVisible()

  // Like "Middle liked" once
  const middleLiked = page.locator('.blog').filter({ hasText: 'Middle liked' })
  await middleLiked.getByRole('button', { name: 'view' }).click()
  await middleLiked.getByRole('button', { name: 'like' }).click()
  await expect(middleLiked.getByText('Likes: 1')).toBeVisible()

  // "Least liked" stays at 0
  const blogs = page.locator('.blog')
  await expect(blogs.nth(0)).toContainText('Most liked')
  await expect(blogs.nth(1)).toContainText('Middle liked')
  await expect(blogs.nth(2)).toContainText('Least liked')
})
})