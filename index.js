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

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000)
}

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
})

app.get('/api/persons/:id', (request, response, next) => {
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
            next(error);
        })
})

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
});

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date();
            response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
        })
        .catch(error => {
            next(error);
        });
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'Name and number are required'});
    }

    Person.findByIdAndUpdate(id, {name: body.name, number: body.number}, {new: true})
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson);
            } else {
                response.status(404).send('Person not found').end();
            }
        })
        .catch(error => {
            next(error);
        });
});

app.delete('/api/persons/:id', (request, response, next) => {
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
            next(error);
        });
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'Malformatted ID'})
    }

    if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }

    return response.status(500).send({error: 'Internal Server Error'})
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});