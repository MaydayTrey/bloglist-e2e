// bloglist-e2e/tests/helper.js
import { expect } from '@playwright/test'

const wipeDB = async (request) => {
  await request.post('http://localhost:3001/api/testing/reset')
}

const createUser = async (request, name, username, password) => {
  await request.post('http://localhost:3001/api/users', {
    data: { name, username, password }
  })
}

const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByText('logged in', { exact: false })).toBeVisible()
}

const createBlog = async (page, author, title, url) => {
  await page.getByRole('link', { name: 'create new' }).click()

  await page.getByLabel('Author').fill(author)
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('URL').fill(url)

  await page.getByRole('button', { name: 'Create blog' }).click()
  await expect(page.getByRole('link', { name: `${title} ${author}` })).toBeVisible()
}

export { loginWith, wipeDB, createUser, createBlog }