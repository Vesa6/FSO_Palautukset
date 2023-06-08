import React, { useState } from 'react'
import PersonForm from './Components/PersonForm'
import Filter from './Components/Filter'
import Persons from './Components/Persons'

const App = () => {
  //States:
  //persons: array of objects
  //newName: empty string
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameToSearch, setNewSearch] = useState('')

  const addName = (event) => {

    //Otherwise the name list resets when we enter duplicate
    event.preventDefault()

    const alreadyExists = persons.some(person => person.name === newName)

    if (alreadyExists) {
      alert(`${newName} is already added to phonebook`)

      //Gets out of the addName function, so we never get to add the duplicate name.
      return
    }

    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }

    setPersons(persons.concat(nameObject))
    setNewNumber('')
    setNewName('')
  }

  const shownPeople = persons.filter(person => person.name.toLowerCase().includes(nameToSearch.toLowerCase()))

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }
    
//PersonForm, how to move functions the new file so they still work?

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameToSearch={nameToSearch} handleSearch={handleSearch}/>
      <h2>Add new</h2>
      <PersonForm onSubmit={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={shownPeople}/>
    </div>
  )

}


export default App