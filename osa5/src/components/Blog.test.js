import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// These are needed to render in tests
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'Title1',
    author: 'Author1',
    url: 'Url1',
    likes: 1,
  }

  render(<Blog blog={blog} />)
  screen.debug()


  // Has to be done like this cus DOM seems to think these are one element.
  const element = screen.getByText('Title1 Author1')

  const urlEle = screen.queryByText('Url1')
  const likesEle = screen.queryByText('likes 1')

  expect(element).toBeDefined()
  expect(urlEle).toBeNull()
  expect(likesEle).toBeNull()
})

test('clicking button shows likes and url', async () => {
  const blog = {
    title: 'Title1',
    author: 'Author1',
    url: 'Url1',
    likes: 1,
  }

  // Makes a "stub" implementation that returns whatever we want it to
  const mockHandler = jest.fn()

  render(<Blog blog={blog} liked={mockHandler} />)

  const button = screen.getByText('view')
  await userEvent.click(button)

  const urlEle = screen.getByText('Url1')
  const likesEle = screen.getByText('likes 1')

  // If these exist, pressing the button correctly shows them
  expect(urlEle).toBeDefined()
  expect(likesEle).toBeDefined()
})

test('clicking like twice calls the handler twice', async () => {
  const blog = {
    title: 'LikeTitle',
    author: 'LikeAuthor1',
    url: 'LikeUrl1',
    likes: 1,
  }

  // Makes a "stub" implementation that returns whatever we want it to
  const mockHandler = jest.fn()

  render(<Blog blog={blog} liked={mockHandler} />)

  const view = screen.getByText('view')
  await userEvent.click(view)

  const like = screen.getByText('like')
  await userEvent.click(like)
  expect(mockHandler.mock.calls).toHaveLength(1)
  await userEvent.click(like)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('BlogForm call works correctly', async () => {
  const mockHandler = jest.fn()
  const user = userEvent.setup()

  // mockHandler is given as prop instead of addBlog
  const { container } = render(<BlogForm createBlog={mockHandler} />)

  // user.click(screen.getByText('New blog'))

  const boxes = screen.getAllByRole('textbox')

  //get by role and index?
  const title = boxes[0]
  const author = boxes[1]
  const url = boxes[2]
  const save = screen.getByText('save')

  // console.log(boxes)

  await user.type(title, 'test title')
  await user.type(author, 'test author')
  await user.type(url, 'test url')
  await userEvent.click(save)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('test title')
  expect(mockHandler.mock.calls[0][0].author).toBe('test author')
  expect(mockHandler.mock.calls[0][0].url).toBe('test url')

})