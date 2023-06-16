import React from 'react'

const Persons = ({persons, handleDelete}) => {
    return (
        <div>
            {persons.map(person => 
                <div key={person.id}>
                    <li>{person.name} {" " + person.number}
                    <button onClick={() => handleDelete(person.id)}>delete</button>
                    </li>
                </div>
            )}
        </div>
    )
}

export default Persons
