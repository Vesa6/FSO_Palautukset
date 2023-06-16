import React from 'react'

const PersonForm = (props) => {

    const ChangeName = props.handleNameChange;
    const SubmitFunction = props.onSubmit;
    const Number = props.newNumber;
    const Name = props.newName;
    const ChangeNumber = props.handleNumberChange;

    return (
        <form onSubmit={SubmitFunction}>
            <div>
            name: <input value={Name} onChange={ChangeName} />
            </div>
            <div>
              number: <input value={Number} onChange={ChangeNumber}/>
            </div>
            <div>
              <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm
