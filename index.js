const express = require("express");

const app = express();
const PORT = 3001;

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.use(express.json());

app.get("/", (request, response) => {
    response.send("<h1> Phone Book </h1>");
});

app.get("/info", (request, response) => {
    const totalPersons = persons.length;

    response.send(`
        <p>Phone book has info for ${totalPersons} people</p>
        <p>${Date()}</p>
        `);
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});
//3.3
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    if (!person) {
        return response.sendStatus(404);
    }

    response.json(person);
});
//3.4
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    response.sendStatus(202);
});
//3.5
app.post("/api/persons", (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;
    if (name !== "" && number !== "") {
        const findName = persons.filter((person) => person.name === name);

        console.log(findName, "findname", findName == "");
        if (findName != "") {
            response
                .status(409)
                .json({ error: "the name must be unique" })
                .end();
        } else {
            const newPerson = {
                id: generateId(),
                ...body,
            };
            persons = persons.concat(newPerson);
            response.status(201).end();
        }
    } else {
        console.log("no content");
        response.sendStatus(204);
    }
});

const generateId = () => {
    return Math.round(Math.random() * 1000 + 1);
};

app.listen(PORT, () => {
    console.log(`Server starting in PORT ${PORT}`);
});
