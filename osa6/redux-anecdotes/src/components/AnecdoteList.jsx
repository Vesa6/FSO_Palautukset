import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdoteAction } from '../reducers/anecdoteReducer'
import { newNotificationAction, removeNotificationAction } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => state.anecdotes)
  const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.includes(filter))
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdoteAction({id: id}))
    const anecdote = anecdotes.find(anecdote => anecdote.id === id).content
    dispatch(newNotificationAction('You voted for ' + '"' + anecdote + '"'))
    // This could probably be linked so that all new notifications last 5000
    // For now it is here so the duration can be changed wherever it is used
    setTimeout(() => {
      dispatch(removeNotificationAction())
    }, 5000)
  }

  return (
    filteredAnecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </div>
      </div>
    )
  )
}

export default AnecdoteList
