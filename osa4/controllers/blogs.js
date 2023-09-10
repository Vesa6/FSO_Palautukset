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
    //TODO: Ensure that blog always has ID no matter what
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

// Not needed with middleware
// Preserve for reference

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.post('/', userWare, async (request, response, next) => {
  const body = request.body

  //User is given by the middleware
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!body.title || !body.url) {
    const respondStatus = response.status(400).json({ error: 'no title or url' })
    return respondStatus
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
    response.status(201).json(saved.toJSON())
  // All errors are passed to middleware
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

  const blog = await Blog.findById(request.params.id)

  // const blog = {
  //   title: body.title,
  //   author: body.author,
  //   url: body.url,
  //   likes: body.likes
  // }

  if (body.title !== undefined || body.author !== undefined || body.url !== undefined || body.likes !== undefined) {
    blog.title = body.title
    blog.author = body.author
    blog.url = body.url
    blog.likes = body.likes
  } else {
    return response.status(400).json({ error: 'incomplete blog (all fields not filled)' })
  }

  try {
    const update = await blog.save()
    response.json(update)
  } catch (error) {
    next(error)
  }
})

//   }
//   Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
//     .then(updatedBlog => {
//       response.json(updatedBlog)
//     })
//     .catch(error => next(error))
// })

module.exports = blogsRouter