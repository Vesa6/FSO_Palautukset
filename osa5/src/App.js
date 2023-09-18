import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogAddVisible, setBlogAddVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))
      // setNewBlog('');
      // setAuthor('');
      // setUrl('');
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    } catch (error) {
      console.error('Error: ', error)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input className="usernameField"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input className="passwordField"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  const deletionHandler = async (blog) => {
    try {

      if(window.confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}?`))
      {
        await blogService
          .deletion(blog.id)
        setBlogs(blogs.filter(changed => changed.id !== blog.id))
      } else {
        return
      }
    } catch (exception) {
      setErrorMessage(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }
      , 5000)
    }
  }

  const likeHandler = async (blog) => {
    console.log('Sent from likehandler:', blog)
    const updatedBlog = {
      // Spreads the blog object and adds 1 to the likes
      ...blog,
      likes: blog.likes + 1
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(changed => changed.id === blog.id ? { ...returnedBlog, user: blog.user } : changed))
      //console.log('Updated array:', blogs.map(changed => changed.id === blog.id ? { ...returnedBlog, user: blog.user } : changed))
    } catch (exception) {
      setErrorMessage('Could not update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handleLogout = (event) => {
    event.preventDefault()
    console.log('log out')

    window.localStorage.removeItem('loggedBlogappUser')

    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('username: ' , username, 'password: ', password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or pass')
      setTimeout(() => {
        setErrorMessage(null)
      }
      , 5000)
    }
  }

  const hideWhenVisible = { display: blogAddVisible ? 'none' : '' }
  const showWhenVisible = { display: blogAddVisible ? '' : 'none' }

  // This basically creates a copy array of blogs
  // ... copies everything from blogs to new array
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      <Notification className='error' message={errorMessage} />

      {/* Only renders if the user is not null */}
      {user && sortedBlogs.map(blog => {
        // console.log('Rendering blog:', blog)
        return <Blog key={blog.id} blog={blog} liked={likeHandler} deleted={deletionHandler} loggedUser={user} blogUser={blog.user} />
      })}

      {!user && loginForm()}
      {user && <div>
        <div style={hideWhenVisible}>
          {/* These empty paragraphs are here for padding */}
          <p></p>
          <button onClick={() => setBlogAddVisible(true)}>New blog</button>
        </div>

        <div style={showWhenVisible}>
          {/* These empty paragraphs are here for padding */}
          <p></p>
          <button onClick={() => setBlogAddVisible(false)}>Cancel</button>
          <BlogForm createBlog={addBlog} />
        </div>
        <p>{user.name} logged in</p>
        {logoutForm()}
      </div>
      }
    </div>
  )
}

export default App