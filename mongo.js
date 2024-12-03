const mongoose = require("mongoose");
const DATA_BASE_NAME = "phoneBook";

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://facund097dv:${password}@cluster0.imugh.mongodb.net/${DATA_BASE_NAME}?
retryWrites=true&w=majority&appName=Cluster0`;

// aca falta setear stricquery
mongoose.connect(url);

// Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
    date: Date,
});
// Model
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
    console.log("get all persons...");
    Person.find({}).then((persons) => {
        console.log("phonebook:");
        persons.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else {
    console.log("create...");
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        date: Date(),
    });

    person.save().then((result) => {
        console.log(
            `added ${result.name} number ${result.number} to phonebook`
        );
        mongoose.connection.close();
    });
}

/**
 * const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://facund097dv:${password}@cluster0.imugh.mongodb.net/noteApp?
retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

// step 1 create schema
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
    date: Date,
});

// step 2 create model based on the schema
const Note = mongoose.model("Note", noteSchema);

// step 3 create Javascript object with modeL
// const note = new Note({
//     content: "HTML is easy",
//     important: true,
//     date: new Date(),
// });
Note.find({}).then((result) => {
    result.forEach((note) => {
        console.log(note);
    });
    mongoose.connection.close();
});
// step 4 save note in database
// note.save().then((result) => {
//     console.log("note saved!");
//     console.log(result);
//     mongoose.connection.close();
// });

 */
