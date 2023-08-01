const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3 || body.password === undefined) {
    return response.status(400)
      .json({ error: 'password must be at least 3 characters long' })

  }
  if (body.username.length < 3 || body.username === undefined) {
    return response.status(400)
      .json({ error: 'username must be at least 3 characters long' })
  }

  // If the username is not unique, return error
  const userExist = await User.countDocuments({ username: body.username })
  if (userExist > 0) {
    return response.status(400)
      .json({ error: 'username not unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  // Populate essentially replaces the blog's IDs with their contents.
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter