const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    username: 'TestUser1',
    name: 'Test User',
    password: 'abcdef',
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  let userObject = new User(initialUsers[0])
  await userObject.save()
}, 30000)

test('username and password at least 3 characters long', async () => {
  const userToAdd = {
    username: 'TestUser2',
    name: 'Test User2',
    password: 'ab',
  }

  const usersBeforeAdd = (await api.get('/api/users')).body.length
  await api
    .post('/api/users')
    .send(userToAdd)
    .expect(400)

  const usersAfterAdd = (await api.get('/api/users')).body.length
  expect(usersAfterAdd).toBe(usersBeforeAdd)

  const userToAdd2 = {
    username: 'Te',
    name: 'Test User2',
    password: 'abcdef',
  }

  const usersBeforeAdd2 = (await api.get('/api/users')).body.length
  await api
    .post('/api/users')
    .send(userToAdd2)
    .expect(400)

  const usersAfterAdd2 = (await api.get('/api/users')).body.length
  expect(usersAfterAdd2).toBe(usersBeforeAdd2)
})

afterAll(async () => {
  await mongoose.connection.close()
})