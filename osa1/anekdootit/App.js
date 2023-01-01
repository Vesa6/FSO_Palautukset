import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  //Get a random number in the range of the anecdotes array
  const getRandom = () => {
    const random = Math.floor(Math.random() * anecdotes.length)
    return random
  }

  //Copy the votes array and add a vote to the selected anecdote
  const giveVote = () => {
    var copy = [...votes]; 
    copy[selected] += 1;
    Vote(copy);
  }

  const [selected, setSelected] = useState(getRandom())
  //Votes is an array of 10 zeros that we add votes to
  const [votes, Vote] = useState(new Uint8Array(10))

  //Used for determining the anecdote with the most votes
  const highestVotes = Math.max(...votes);
  const index = votes.indexOf(highestVotes);

  return (
    <div>
      <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <p>This anecdote has {votes[selected]} votes</p>
      </div>
      <button onClick= {giveVote}>Vote</button>
      <button onClick={ () => setSelected(getRandom())}>Next anecdote</button>

      <h2>Anecdote with most votes</h2>
      {anecdotes[index]}
      <p>This anecdote has {votes[index]} votes</p>
    </div>
  )
}

export default App
