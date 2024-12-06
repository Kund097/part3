const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const URL = process.env.MONGODB_URI;
console.log("connecting to...", URL);
mongoose
    .connect(URL)
    .then((result) => console.log("conected to MongoDB"))
    .catch((error) =>
        console.log("error connecting to MongoDB: ", error.message)
    );

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
