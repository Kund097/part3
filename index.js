require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", (request) => JSON.stringify(request.body));

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

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

//3.3
app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    Person.findById(id)
        .then((person) => response.json(person))
        .catch((error) => {
            console.log("error findByID", error);
            response.sendStatus(404);
        });
});
//3.4
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    Person.findOneAndDelete(id);
    response.sendStatus(202);
});
//3.5
async function getAll() {
    return await Person.find({});
}

app.post("/api/persons", async (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;

    if (name !== "" && number !== "") {
        const persons = await getAll();
        console.log(persons);
        const findName = persons.filter((person) => person.name === name);

        if (findName != "") {
            response
                .status(409)
                .json({ error: "the name must be unique" })
                .end();
        } else {
            const newPerson = new Person({
                ...body,
            });
            newPerson.save().then((result) => {
                response.json(result).status(201).end();
            });
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
    if (newNumber !== "") {
        Person.findByIdAndUpdate(
            personId,
            { number: newNumber },
            { new: true }
        ).then((result) => response.json(result));
        // persons = persons.map((person) =>
        //     person.id === personId ? { ...person, number: newNumber } : person
        // );
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server starting in PORT ${PORT}`);
});
