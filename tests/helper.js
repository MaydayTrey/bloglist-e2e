//Serves helper functions

const wipeDB = async(request) => {
    await request.post('http://localhost:3001/api/testing/reset')
}


const loginWith = async(page, username, password) => {
    await page.getByLabel('Username').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Login'}).click()

}


export { loginWith, wipeDB }