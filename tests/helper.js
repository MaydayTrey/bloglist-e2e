//Serves helper functions

const wipeDB = async(request) => {
    await request.post('http://localhost:3001/api/testing/reset')
}

const createUser = async (request, name, username, password) => {
  await request.post('http://localhost:3001/api/users', {
    data: { name, username, password }
  })
}

const loginWith = async(page, username, password) => {
    await page.getByLabel('Username').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Login'}).click()

}

const createBlog = async(page, author, title, url) => {
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
}

export { loginWith, wipeDB, createUser, createBlog }