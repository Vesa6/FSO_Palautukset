import { useDispatch } from 'react-redux';
import { createAnecdoteAction } from '../reducers/anecdoteReducer';
import { newNotificationAction, removeNotificationAction } from '../reducers/notificationReducer'

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
    dispatch(newNotificationAction('You created anecdote ' + '"' + contentOfAnecdote + '"'))
    // This could probably be linked so that all new notifications last 5000
    // For now it is here so the duration can be changed wherever it is used
    setTimeout(() => {
      dispatch(removeNotificationAction())
    }, 5000)
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