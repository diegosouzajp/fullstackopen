const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.json(blog)
  else response.status(404).end()
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  if (!request.body.title || !request.body.url) {
    response.status(400).json(request.body)
    return
  }

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user.id,
    likes: body.likes || 0,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'User Id missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'The ID given does not match with any blog' })
  }

  if (blog.user.toString() !== user.id) {
    return response.status(401).json({ error: 'The user does not have permission to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  console.log('user.blogs before: ', user.blogs)
  user.blogs = user.blogs.filter((item) => item.toString() !== blog.id)
  console.log('user.blogs after: ', user.blogs)
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const savedBlog = await blog.save()
  response.status(200).json(savedBlog)
})

module.exports = blogsRouter
