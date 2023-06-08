import React from 'react'

//This renders all the persons in the phonebook
const Persons = ({ persons }) => {
    return (
        <ul>
            {persons.map(person => <li key={person.id}>{person.name}{" " + person.number}</li>)}
        </ul>
    )
}

export default Persons
