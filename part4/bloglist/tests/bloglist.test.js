const assert = require('node:assert')
const { test, after, describe, beforeEach } = require('node:test')
const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

test('dummy returns 1', () => {
  const result = listHelper.dummy(helper.initialBlogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('blog with the largest amount of likes', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    assert.deepStrictEqual(result, {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    })
  })
})

describe('most blogs', () => {
  test('author with the largest amount of blogs', () => {
    const result = listHelper.mostBlogs(helper.initialBlogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('author with the largest amount of likes', () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('Exercises 4.8 to 4.12', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()

    const response = await api.post('/api/login').send({ username: 'testuser', password: 'testpassword' })

    token = response.body.token
  })

  test('amount of blogs in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 6)
  })

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      assert.strictEqual(Object.hasOwn(blog, 'id'), true)
      assert.strictEqual(Object.hasOwn(blog, '_id'), false)
    })
  })

  test('adding a new blog', async () => {
    const newBlog = {
      title: 'Creating a new blog',
      author: 'Diego Luiz de Souza',
      url: 'testing.app.com',
      likes: 245,
      id: '68a334e8ec046c4b75d3ac53',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})

    const blogsJSON = blogsAtEnd.map((blog) => blog.toJSON())
    assert.strictEqual(blogsJSON.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    assert(titles.includes('Creating a new blog'))
  })

  test('if likes is missing, it defaults to zero', async () => {
    const newBlog = {
      title: 'Likes property is missing',
      author: 'Diego Luiz de Souza',
      url: 'testing.app.com',
      id: '68a334e8ec046c4b75d3ac53',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})

    const blogsJSON = blogsAtEnd.map((blog) => blog.toJSON())
    assert.strictEqual(blogsJSON[blogsJSON.length - 1].likes, 0)
  })

  test('if title is missing, get status 400 Bad Request', async () => {
    const newBlog = {
      author: 'Diego Luiz de Souza',
      url: 'testing.app.com',
      id: '68a334e8ec046c4b75d3ac53',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('if url is missing, get status 400 Bad Request', async () => {
    const newBlog = {
      title: 'New blog with url missing',
      author: 'Diego Luiz de Souza',
      id: '68a334e8ec046c4b75d3ac53',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Exercises 4.13 to 4.14', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()

    await Blog.deleteMany({})
    await Blog.insertMany({
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      user: user.id,
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
    })

    const response = await api.post('/api/login').send({ username: 'testuser', password: 'testpassword' })

    token = response.body.token
  })

  test.only('deleting a single post resource', async () => {
    let response = await api.get('/api/blogs')
    let blogs = response.body
    const initialAmount = blogs.length

    await api.delete(`/api/blogs/${blogs[0].id}`).set('Authorization', `Bearer ${token}`).expect(204)

    response = await api.get('/api/blogs')
    blogs = response.body

    assert.strictEqual(blogs.length, initialAmount - 1)
  })

  test('updating the number of likes of a single post', async () => {
    let response = await api.get('/api/blogs')
    let blogs = response.body
    let firstBlog = blogs[0]
    const initialLikes = firstBlog.likes
    firstBlog.likes++

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(firstBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    response = await api.get('/api/blogs')
    blogs = response.body
    firstBlog = blogs[0]

    assert.strictEqual(firstBlog.likes, initialLikes + 1)
  })
})

describe('Exercises 4.15 to 4.23', () => {
  test('username must be given', async () => {
    const newUser = {
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'User validation failed: username: Path `username` is required.' })
  })

  test('password must be given', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'User validation failed: Password is required' })
  })

  test('username must be at least 3 characters long', async () => {
    const newUser = {
      username: 'ml',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'User validation failed: username: Username must be at least 3 characters long.' })
  })

  test('password must be at least 3 characters long', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'User validation failed: Password must be at least 3 characters long' })
  })

  test('username must be unique', async () => {
    await User.deleteMany({})

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser)

    const userWithSameUsername = {
      username: 'mluukkai',
      name: 'Another Guy',
      password: 'somepassword',
    }

    await api
      .post('/api/users')
      .send(userWithSameUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'expected `username` to be unique' })
  })

  test.only('adding a blog fails with status 401 if a token is not provided', async () => {
    await Blog.deleteMany({})

    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'token invalid' })
  })
})

after(async () => {
  await mongoose.connection.close()
})
