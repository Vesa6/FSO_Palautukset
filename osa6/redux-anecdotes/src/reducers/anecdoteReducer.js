const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

export const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

export const voteAnecdoteAction = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdoteAction = (anec) => {
  const newAnec = asObject(anec)

  return {
    type: 'ADD',
    data: newAnec,
  };  
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  let stateToReturn = state;

  if(action.type == 'VOTE')
  {
    const idOfAnecdote = action.data.id
    const anec = state.find(a => a.id === idOfAnecdote)
    const changedAnec = { ...anec, votes: anec.votes + 1 }
    stateToReturn = state.map(a => a.id !== idOfAnecdote ? a : changedAnec)
  }

  else if (action.type === 'ADD')
  {
    stateToReturn = [...state, action.data]
  }

  // Sorts in place
  stateToReturn.sort((a, b) => b.votes - a.votes)

  return stateToReturn
}


export default reducer