const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
]

let auth

beforeAll(async () => {
  const new_user = {
    name: 'Test User',
    username: 'test',
    password: 'test'
  }

  await api
    .post('/api/users')
    .send(new_user)

  const response = await api
    .post('/api/login')
    .send(new_user)

  auth = {
    'Authorization': `bearer ${response.body.token}`
  }
})

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
}, 30000)

test('blogs are returned as json', async () => {

  await api
    .get('/api/blogs')
    .expect(200)
    // Weird syntax is regex to check application/json
    .expect('Content-Type', /application\/json/)
}, 30000)

test('3 blogs exist', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(3)
}, 30000)

test('unique id of blogs is called id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[1]
  // Checks that the id field exists
  expect(blog.id).toBeDefined()
}, 30000)

test('blog added with corect data', async () => {
  const blog = {
    title: 'Test',
    author: 'Test A',
    url: 'http://www.test.org',
    likes: 1
  }

  const blogsBeforeAdd = (await api.get('/api/blogs')).body.length

  await api
  // Makes the http post req...
    .post('/api/blogs')
  // Puts the blog in the body
    .send(blog)
    .set(auth)
  // Check that it was returned as correct type
    .expect('Content-Type', /application\/json/)

  // Finally, check that there is one more blog than there was before
  const blogsAfterAdd = (await api.get('/api/blogs')).body.length
  expect(blogsAfterAdd).toBe(blogsBeforeAdd + 1)
})

test('likes default to 0', async () => {

  // Blog doesn't have like property
  const blog = {
    title: 'Test',
    author: 'Test A',
    url: 'http://www.test.org'
  }

  const response = await api
  // Makes the http post req...
    .post('/api/blogs')
  // Puts the blog in the body
    .send(blog)
    .set(auth)

  expect(response.body.likes).toBe(0)
})

test('no title or url not added', async () => {
  const blog = {
    author: 'Test A',
    likes: 1
  }

  const blogsBeforeAdd = (await api.get('/api/blogs')).body.length

  await api
    .post('/api/blogs')
    .send(blog)
    .set(auth)
    .expect(400)

  const blogsAfterAdd = (await api.get('/api/blogs')).body.length

  expect(blogsAfterAdd).toBe(blogsBeforeAdd)
}, 30000)


test('no title not added', async () => {
  const blog = {
    author: 'Test A',
    url: 'http://www.test.org',
    likes: 1
  }

  const blogsBeforeAdd = (await api.get('/api/blogs')).body.length

  await api
    .post('/api/blogs')
    .send(blog)
    .set(auth)
    .expect(400)

  const blogsAfterAdd = (await api.get('/api/blogs')).body.length

  expect(blogsAfterAdd).toBe(blogsBeforeAdd)
}, 30000)

test('delete blog', async () => {
  const blogsBeforeAdd = (await api.get('/api/blogs')).body.length
  const blogToDelete = (await api.get('/api/blogs')).body[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set(auth)
    // 204 No content
    .expect(204)

  const blogsAfterAdd = (await api.get('/api/blogs')).body.length
  expect(blogsAfterAdd).toBe(blogsBeforeAdd-1)
})

test('update blog', async () => {
  const blogLikesBeforeUpdate = (await api.get('/api/blogs')).body[0].likes
  const blogToUpdate = (await api.get('/api/blogs')).body[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      likes: blogLikesBeforeUpdate + 1
    })
    .set(auth)
    // 200 OK
    .expect(200)

  const blogLikesAfterUpdate = (await api.get('/api/blogs')).body[0].likes

  expect(blogLikesAfterUpdate).toBe(blogLikesBeforeUpdate + 1)
})

test('blog fails if no token', async () => {
  const blog = {
    author: 'Test A',
    url: 'http://www.test.org',
    likes: 1
  }

  const blogsBeforeAdd = (await api.get('/api/blogs')).body.length

  await api
  // Makes the http post req...
    .post('/api/blogs')
  // Puts the blog in the body
    .send(blog)
  // Check that it was returned as correct type
    .expect('Content-Type', /application\/json/)

  // Finally, check that there is one more blog than there was before
  const blogsAfterAdd = (await api.get('/api/blogs')).body.length
  // If auth is not set, should be the same
  expect(blogsAfterAdd).toBe(blogsBeforeAdd)

})

afterAll(async () => {
  await mongoose.connection.close()
})