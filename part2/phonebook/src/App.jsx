import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ newSearch, handleSearchChange }) => {
  return (
    <div>
      Filter shown with <input value={newSearch} onChange={handleSearchChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, newSearch, deletePerson }) => {
  return persons.map((person) => {
    if (person.name.toLowerCase().includes(newSearch.toLowerCase())) {
      return (
        <div key={persons.indexOf(person)}>
          {person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button>
        </div>
      )
    }
  })
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState(null)

  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons)
      console.log('rendering', persons.length, 'persons')
    })
  }, [])

  // const addPerson = (event) => {
  //   event.preventDefault()

  //   personService
  //     .getAll()
  //     .then((allPersons) => {
  //       setPersons(allPersons)
  //       return allPersons
  //     })
  //     .then((allPersons) => {
  //       const personAlreadyAdded = allPersons.find((person) => person.name.toLowerCase() === newName.toLowerCase())
  //       if (
  //         personAlreadyAdded &&
  //         confirm(`${newName} is already added to Phonebook, replace the old number with a new one?`)
  //       ) {
  //         personService
  //           .update(personAlreadyAdded.id, { name: newName, number: newNumber })
  //           .then(() => {
  //             personService.getAll().then((persons) => {
  //               setPersons(persons)
  //               setMessage(`The number of ${newName} has changed`)
  //               setColor('green')
  //               setTimeout(() => {
  //                 setMessage(null)
  //                 setColor(null)
  //               }, 5000)
  //               setNewName('')
  //               setNewNumber('')
  //             })
  //           })
  //           .catch(() => {
  //             setMessage('An error ocurred')
  //             setColor('red')
  //           })
  //       } else {
  //         personService
  //           .create({ name: newName, number: newNumber })
  //           .then(() => {
  //             personService.getAll().then((persons) => {
  //               setPersons(persons)
  //               setMessage(`Added ${newName}`)
  //               setColor('green')
  //               setTimeout(() => {
  //                 setMessage(null)
  //                 setColor(null)
  //               }, 5000)
  //               setNewName('')
  //               setNewNumber('')
  //             })
  //           })
  //           .catch(() => {
  //             setMessage('An error ocurred')
  //             setColor('red')
  //           })
  //       }
  //     })
  // }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  // The following version of the funcion addPerson has the purpose of satisfying the Exercise 2.17.
  // A better version, that updates the 'persons' state before each operation, is commented above.

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  const addPerson = (event) => {
    event.preventDefault()

    const personAlreadyAdded = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase())

    if (personAlreadyAdded) {
      if (confirm(`${newName} is already added to Phonebook, replace the old number with a new one?`)) {
        personService
          .update(personAlreadyAdded.id, {
            name: newName,
            number: newNumber,
          })
          .then(() => {
            personService.getAll().then((persons) => {
              setPersons(persons)
              setMessage(`The number of ${newName} has changed`)
              setColor('green')
            })
          })
          .then(() => {
            setTimeout(() => {
              setMessage(null)
              setColor(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setMessage(`Information of ${newName} has already been removed from the server`)
            setColor('red')
          })
      } else return
    } else {
      personService.create({ name: newName, number: newNumber }).then(() => {
        personService
          .getAll()
          .then((persons) => {
            setPersons(persons)
            setMessage(`Added ${newName}`)
            setColor('green')
          })
          .then(() => {
            setTimeout(() => {
              setMessage(null)
              setColor(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
      })
    }
  }

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id).then(() => personService.getAll().then((persons) => setPersons(persons)))
    }
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} color={color} />
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} newSearch={newSearch} deletePerson={deletePerson} />
    </div>
  )
}

export default App
