import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: author,
      url: url,
      likes: 0
    })

    setNewBlogTitle('')
    setAuthor('')
    setUrl('')
  }

  // This requires the prop to be a function (and not undefined)
  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input className='title'
            name="title"
            value={newBlogTitle}
            onChange={event => setNewBlogTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <input className='author'
            name="author"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <input className='url'
            name="url"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
