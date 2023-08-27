import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog,
      author: author,
      url: url,
      likes: 0
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
        setAuthor('')
        setUrl('')
        
        setErrorMessage(`a new blog ${newBlog} by ${author} added`)
        setTimeout(() => {
        setErrorMessage(null)
      }
      , 3000)
      })
  }

  const handleBlogChange = (event) => {
    const value = event.target.value;
    const field = event.target.name;

    // console.log(event.target.value)
    // setNewBlog(event.target.value)

    if (field === 'title') {
      setNewBlog(value)
    }
    if (field === 'author') {
      setAuthor(value)
    }
    if (field === 'url') {
      setUrl(value)
    }
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          name="title"
          value={newBlog}
          onChange={handleBlogChange}
      />
      </div>
      <div>
        author:
        <input
          name="author"
          value={author}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url:
        <input
          name="url"
          value={url}
          onChange={handleBlogChange}
        />
      </div>
      <button type="submit">save</button>
    </form>  
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

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

  // Continue to figure out how to make login render conditionally, when user is logged in -> show login
  // If not, show blogs.

  return (
    <div>
      <h2>blogs</h2>

      <Notification className='error' message={errorMessage} />

      {/* Only renders if the user is not null */}
      {user && blogs.map(blog => <Blog key={blog.id} blog={blog} />)}

      {!user && loginForm()} 
      {user && <div>
       <p>{user.name} logged in</p>
         {blogForm()}
       <p></p>
        {logoutForm()}
      </div>
    }
    </div>
  )
}

export default App