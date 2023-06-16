import React from 'react'

const Filter = ({ nameToSearch, handleSearch }) => {
    return (
        <div>
            filter shown with <input value={nameToSearch} onChange={handleSearch}/>
        </div>
    )
}

export default Filter
