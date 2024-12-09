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

app.get("/info", async (request, response) => {
    const totalPersons = (await Person.find({})).length;

    response.send(`
        <p>Phone book has info for ${totalPersons} people</p>
        <p>${Date()}</p>
        `);
});

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    Person.findById(id)
        .then((person) => {
            if (person) {
                // si person es null, entonces null == falsy Y responde con el estado 404
                response.json(person);
            } else {
                response.sendStatus(404);
            }
        })
        .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted" });
    } else if (error.name === "ValidationError") {
        return response.status(400).send({ error: error.message });
    }

    next(error);
};

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: "unknownEndPoint" });
};

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id)
        .then((result) => {
            console.error("result delete", result);
            if (result) {
                response.status(204).end();
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

async function getAll() {
    return await Person.find({});
}

app.post("/api/persons", async (request, response, next) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;

    // if (name !== "" && number !== "") {
    const persons = await getAll();
    const findName = persons.filter((person) => person.name === name);

    if (findName != "") {
        response.status(409).json({ error: "the name must be unique" }).end();
    } else {
        const newPerson = new Person({
            ...body,
        });
        newPerson
            .save()
            .then((result) => {
                response.json(result).status(201).end();
            })
            .catch((error) => next(error));
    }
    // } else {
    //     console.log("no content");
    //     response.sendStatus(204);
    // }
});

app.put("/api/persons/:id", (request, response) => {
    const body = request.body;
    const newNumber = body.number;
    const personId = body.id;
    if (newNumber !== "") {
        Person.findByIdAndUpdate(
            personId,
            { number: newNumber },
            { new: true, runValidators: true, context: "query" }
        ).then((result) => response.json(result));
    }
});
app.use(unknownEndPoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server starting in PORT ${PORT}`);
});
