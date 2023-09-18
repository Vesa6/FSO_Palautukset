//Makes a new router object.
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userWare = require('../utils/middleware').userWare


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})


blogsRouter.post('/', userWare, async (request, response, next) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'no title or url' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  try {
    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()

    const populatedBlog = await Blog.findById(saved._id).populate('user', { username: 1, name: 1, _id: 1 })
    response.status(201).json(populatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})


blogsRouter.delete('/:id', userWare, async (request, response, next) => {

  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(error){
    next(error)
  }
}
)

//   Blog.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

blogsRouter.put('/:id', userWare, async (request, response, next) => {
  const body = request.body

  let blog = await Blog.findById(request.params.id)

  if (body.title !== undefined) {
    blog.title = body.title
  }
  if(body.author !== undefined) {
    blog.author = body.author
  }
  if (body.url !== undefined)  {
    blog.url = body.url
  }
  if (body.likes !== undefined) {
    blog.likes = body.likes
  }

  // Save the updated blog
  try {
    const savedBlog = await blog.save()

    // Populate the user field for the saved blog
    blog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1, _id: 1 })

    //console.log('before save: ' + blog)

    response.json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter