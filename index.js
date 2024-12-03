const express = require("express");
const morgan = require("morgan");
const app = express();

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

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", (request) => JSON.stringify(request.body));

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

// app.use(
//     morgan((tokens, req, res) => {
//         return [
//             tokens.method(req, res),
//             tokens.url(req, res),
//             tokens.status(req, res),
//             tokens.res(req, res, "content-length"),
//             "-",
//             tokens["response-time"](req, res),
//             "ms",
//             JSON.stringify(req.body),
//         ].join(" ");
//     })
// );

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
            response.json(newPerson).status(201).end();
        }
    } else {
        console.log("no content");
        response.sendStatus(204);
    }
});

const generateId = () => {
    return Math.round(Math.random() * 1000 + 1);
};

app.put("/api/persons/:id", (request, response) => {
    const body = request.body;
    const newNumber = body.number;
    const personId = body.id;
    debugger;
    if (newNumber !== "") {
        persons = persons.map((person) =>
            person.id === personId ? { ...person, number: newNumber } : person
        );
    }
    response.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server starting in PORT ${PORT}`);
});
