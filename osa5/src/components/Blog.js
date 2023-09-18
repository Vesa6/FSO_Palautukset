import { useState } from 'react'

const Blog = ({ blog, liked, deleted, loggedUser, blogUser }) => {
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

  // console.log(blog.user.username)
  // console.log(loggedUser.username)

  // spans are used for inline classNames because <p> makes a new line.
  return(
    // Sets some nice borders around each blog to make it more readable
    <div style = {blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => changeVisibility()}>{visible}</button>
      {blogDetailsVisible && (
        <div>
          <span className="url">{blog.url}</span>
          <br />
          <span className="likes">likes {blog.likes}</span>
          <br />
          <button className="likeButton" onClick={() => liked(blog)}>like</button>
          <br />
          {blog.author}
          {blog.user.username === loggedUser.username && (
            <p><button onClick={() => deleted(blog)}>delete</button></p>
          )}
        </div>
      )}
    </div>
  )
}


export default Blog