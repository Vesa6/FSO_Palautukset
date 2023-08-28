import { useState } from 'react'

const Blog = ({blog}) => {
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false)

  const changeVisibility = () => {
    setBlogDetailsVisible(!blogDetailsVisible)
  }

  const visible = blogDetailsVisible ? 'hide' : 'view'

  return(
    // Sets some nice borders around each blog to make it more readable
  <div style = {blogStyle}>
    {blog.title} {blog.author}  
    <button onClick={() => changeVisibility()}>{visible}</button>
    {blogDetailsVisible && (
        <div>
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={blog.liked}>like</button>
          <br />
          {blog.author}     
        </div>
      )}
    </div>
  )
}

export default Blog