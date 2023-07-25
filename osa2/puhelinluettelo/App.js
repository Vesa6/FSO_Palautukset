import { useEffect } from 'react'
import React, { useState } from 'react'
import PersonForm from './Components/PersonForm'
import Filter from './Components/Filter'
import Persons from './Components/Persons'
import Communication from './Components/Communication'
import Notification from './Components/Notification'

const App = () => {
  //States:
  //persons: array of objects
  //newName: empty string
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameToSearch, setNewSearch] = useState('')
  const [newId, setNewId] = useState(1)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('Fethching people from server')
    Communication.getAll()
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response)
      //This fixes the problem of the id not being unique
      //if deleting from halfway through the list.
      setNewId(response.length + 1)
    })
  }, [])

  const addName = (event) => {
    //Otherwise the name list resets when we enter duplicate
    event.preventDefault();

    const alreadyExists = persons.some(person => person.name === newName)

    if (alreadyExists) {
      //Gets out of the addName function, so we never get to add the duplicate name.
      const changedPerson = persons.find(person => person.name === newName)
      changedPerson.number = newNumber

      Communication
        .update(changedPerson.id, changedPerson)
        .then(reply => {

        setPersons(persons.map(person => person.id !== changedPerson.id ? person : reply))

        setNewNumber('');
        setNewName('')

        setErrorMessage('Number of ' + changedPerson.name + ' changed to ' + changedPerson.number);
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
      
      .catch(error => {
        setErrorMessage(`${changedPerson.name} already removed, could not update number.`);
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      });

      return
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: newId,
    }

    Communication
    .create(nameObject)
    .then(response => {
      console.log('promise OK')
      setPersons(persons.concat(response))
      setNewId(newId + 1)
      setNewNumber('')
      setNewName('')

      setErrorMessage(
        `Added ${nameObject.name}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    })
  }

  
  const shownPeople = persons.filter(person => person.name.toLowerCase().includes(nameToSearch.toLowerCase()))

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleDelete = (id) => {
    if(window.confirm(`Are you sure you want to delete ${persons.find(person => person.id === id).name}? `) !== true) {
      return;
    } 
    Communication.deletePerson(id).then(() => {
      //Make a new list of people, excluding the one with removed id.
      const filteredPeople = persons.filter(person => person.id !== id)
      setPersons(filteredPeople)

      setErrorMessage(
        `Deleted ${persons.find(person => person.id === id).name}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    });
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <Notification className='error' message={errorMessage} />
      <h2>Phonebook</h2>
      <Filter nameToSearch={nameToSearch} handleSearch={handleSearch}/>
      <h2>Add new</h2>
      <PersonForm onSubmit={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={shownPeople} handleDelete={handleDelete} />

    </div>
  )
}

export default App