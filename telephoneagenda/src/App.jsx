import {useEffect, useState} from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import axios from "axios";
import personService from "./services/persons";
import './index.css'

const Notification = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className="success">
            {message}
        </div>
    )
}

const ErrorNotification = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [personsAux, setPersonAux] = useState([])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')

    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        personService.getAll()
            .then((response) => {
                setPersons(response.data)
                setPersonAux(response.data)
            })
    }, [])

    const ShowMessage = (message) => {
        setMessage(message)
        setTimeout(() => {
            setMessage(null)
        }, 3000)
    }

    const ShowErrorMessage = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 3000)
    }
    const addPerson = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number: newNumber
        }


        if (newNumber.length === 0 || newName.length === 0) {
            alert("Some of the fields are empty")
            return
        }

        if (persons.find((person) => person.name === newName)) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                personService.update(persons.find((person) => person.name === newName).id, personObject)
                    .then((response) => {
                        setPersons(persons.map((person) => person.id !== response.data.id ? person : response.data))
                        setPersonAux(persons.map((person) => person.id !== response.data.id ? person : response.data))
                        ShowMessage(`${newName} updated in phonebook`)
                    })
            }
            setNewName('')
            setNewNumber('')
            return
        }

        if (persons.find((person) => person.number === newNumber)) {
            alert(`${newNumber} is already added to phonebook`)
            setNewNumber('')
            return
        }

        personService.create(personObject)
            .then((response) => {
                setPersons(persons.concat(response.data))
                setPersonAux(persons.concat(response.data))
                setSearch('')
                setNewName('')
                setNewNumber('')
                ShowMessage(`${newName} added to phonebook`)
            })


    }

    const deletePerson = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            personService
                .remove(id)
                .then((response) => {
                    setPersons(persons.filter((person) => person.id !== id))
                    setPersonAux(persons.filter((person) => person.id !== id))
                    ShowMessage(`${name} deleted from phonebook`)
                }).catch((error) => {
                ShowErrorMessage(`Information of ${name} has already been removed from server`)
                setPersons(persons.filter((person) => person.id !== id))
                setPersonAux(persons.filter((person) => person.id !== id))
            })
        }
    }

    const handlePersonChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
        if (event.target.value === '') {
            setPersonAux([...persons])
            return
        }
        setPersonAux(persons.filter((person) => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
    }

    return (
        <div>
            <Notification message={message}/>
            <ErrorNotification message={errorMessage}/>
            <Filter value={search} onValueChange={handleSearchChange}/>
            <h2>Phonebook</h2>
            <h3>Add a new</h3>
            <PersonForm
                addPerson={addPerson}
                newName={newName}
                handlePersonChange={handlePersonChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />

            <h2>Numbers</h2>
            <Persons persons={personsAux} onClickDelete={deletePerson}/>
        </div>
    )
}

export default App