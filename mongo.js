const mongoose = require('mongoose')
require('dotenv').config()


//Now the password is in the environment variable MONGODB_URI
// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }


const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then(result => {
      console.log('Person saved!', result)
      mongoose.connection.close()
    })
    .catch(error => {
      console.error('Error saving person:', error)
    })
} else {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.error('Error fetching persons:', error)
    })
}

//Example to insert many people

// const people = [
//     new Person({
//         name: 'Arto Hellas',
//         number: '040-123456'
//     }),
//     new Person({
//         name: 'Ada Lovelace',
//         number: '39-44-5323523'
//     }),
//     new Person({
//         name: 'Dan Abramov',
//         number: '12-43-234345'
//     }),
//     new Person({
//         name: 'Mary Poppendieck',
//         number: '39-23-6423122'
//     })
// ]
//
// Person.insertMany(people)
//     .then(result => {
//         console.log('Persons saved!', result)
//         mongoose.connection.close()
//     })
//     .catch(error => {
//         console.error('Error saving persons:', error)
//     })

