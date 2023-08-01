const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0
  for (let i = 0; i < blogs.length; i++) {
    likes += blogs[i].likes
  }
  return likes
}

const favoriteBlog = (blogs) => {
  let favorite = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (favorite.likes <= blogs[i].likes) {
      favorite = blogs[i]
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  let authors = []

  blogs.forEach(blog => {
    let author = authors.find(a => a.author === blog.author)
    if (author) {
      author.blogs++
    } else {
      authors.push({
        author: blog.author,
        blogs: 1
      })
    }
  })

  let mostBlogs = authors[0]
  authors.forEach(element => {
    if (mostBlogs.blogs < element.blogs) {
      mostBlogs = element
    }
  })
  return mostBlogs
}

const mostLikes = (blogs) => {
  let authors = []

  blogs.forEach(blog => {
    let author = authors.find(a => a.author === blog.author)
    if (author) {
      author.likes += blog.likes
    } else {
      authors.push({
        author: blog.author,
        likes: blog.likes
      })
    }
  })

  let mostLiked = authors[0]

  authors.forEach(element => {
    if (element.likes > mostLiked.likes) {
      mostLiked = element
    }
  })
  return mostLiked
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}