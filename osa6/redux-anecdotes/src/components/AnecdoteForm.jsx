import { useDispatch } from 'react-redux';
import { createAnecdoteAction } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newAnecdote = (event) => {
    event.preventDefault()
    const contentOfAnecdote = event.target.anecdote.value
    // const newAnecdoteObject = {
    //   content: contentOfAnecdote,
    //   id: getId(),
    //   votes: 0
    // }
    event.target.anecdote.value = ''
    dispatch(createAnecdoteAction(contentOfAnecdote))
  }

  return(
    <div>
      <h2>create new</h2>
        <form onSubmit={newAnecdote}>
          <div><input name="anecdote" /></div>
          <button type="submit">create</button>
        </form>
    </div>
  )
}

export default AnecdoteForm;