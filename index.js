const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.json())

const Person = require('./models/person')

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

let notes = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
    })
    // response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).send('Person not found, try another ID').end()
            }
        })
        .catch(error => {
            response.status(400).send('Malformatted ID').end()
        })
    // const id = Number(request.params.id)
    // const note = notes.find(note => note.id === id)
    //
    // if (note) {
    //     response.json(note)
    // } else {
    //     response.status(404)
    //     response.send('Person not found, try another ID').end()
    // }
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'content missing'});
    }

    Person.findOne({name: body.name}).then(existingPerson => {
        if (existingPerson) {
            return response.status(400).json({error: 'name must be unique'});
        }

        const person = new Person({
            name: body.name,
            number: body.number,
        });

        person.save()
            .then(savedPerson => response.json(savedPerson))
            .catch(error => response.status(500).json({error: 'failed to save person'}));
    }).catch(error => response.status(500).json({error: 'database error'}));

    // const body = request.body
    // if (!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: 'content missing'
    //     })
    // }
    //
    // const nameExists = notes.find(note => note.name === body.name)
    // if (nameExists) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    //
    // const note = {
    //     name: body.name,
    //     number: body.number,
    //     id: generateRandomId()
    // }
    // notes = notes.concat(note)
    // response.json(note)
});

app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date();
            response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
        })
        .catch(error => {
            response.status(500).send('Database error').end();
        });
    // const date = new Date()
    // response.send(`<p>Phonebook has info for ${notes.length} people</p><p>${date}</p>`)
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(id, person, {new: true})
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(deletedPerson => {
            if (deletedPerson) {
                response.status(204).end();
            } else {
                response.status(404).send('Person not found, try another ID').end();
            }
        })
        .catch(error => {
            response.status(400).send('Malformatted ID').end();
        });
    // const id = Number(request.params.id)
    // const note = notes.find(note => note.id === id)
    // if (note) {
    //     notes = notes.filter(note => note.id !== id)
    //     response.json(notes)
    //     response.status(204).end()
    // } else {
    //     response.status(404)
    //     response.send('Person not found, try another ID').end()
    // }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});