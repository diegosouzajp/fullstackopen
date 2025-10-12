const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.length === 0 ? 0 : blogs.reduce((current, blog) => blog.likes + current, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
}

const mostBlogs = (blogs) => {
  let authors = []

  blogs.forEach((blog) => {
    const index = authors.findIndex((author) => author.author === blog.author)

    if (index === -1) authors.push({ author: blog.author, blogs: 1 })
    else authors[index].blogs++
  })

  return authors.reduce((previous, author) => (author.blogs > previous.blogs ? author : previous))
}

const mostLikes = (blogs) => {
  let authors = []

  blogs.forEach((blog) => {
    const index = authors.findIndex((author) => author.author === blog.author)

    if (index === -1) authors.push({ author: blog.author, likes: blog.likes })
    else authors[index].likes += blog.likes
  })

  return authors.reduce((previous, author) => (author.likes > previous.likes ? author : previous))
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
