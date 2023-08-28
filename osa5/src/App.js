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

  const addBlog = (blogObject) => {

    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        // setNewBlog('')
        // setAuthor('')
        // setUrl('')
        
        setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
        setErrorMessage(null)
      }
      , 3000)
      })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
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

  const likeHandler = async (blog) => {
    const updated = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }

    blogService
      .update(updated)
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

  return (
    <div>
      <h2>blogs</h2>

      <Notification className='error' message={errorMessage} />

      {/* Only renders if the user is not null
          Pass the likehandler to blog*/}
      {user && blogs.map(blog => <Blog key={blog.id} blog={blog} liked={() => likeHandler(blog)} />)}

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
       <p>{logoutForm()}</p>  
      </div>
    }
    </div>
  )
}

export default App