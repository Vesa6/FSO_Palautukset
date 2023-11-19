import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdoteAction } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => state.anecdotes)
  const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.includes(filter))
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdoteAction({id: id}))
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
