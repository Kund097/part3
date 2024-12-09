const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const URL = process.env.MONGODB_URI;
console.log("connecting to...", URL);
mongoose
    .connect(URL)
    .then(() => {
        return console.log("conected to MongoDB");
    })
    .catch((error) =>
        console.log("error connecting to MongoDB: ", error.message)
    );
const numberValidator = (number) => {
    const requeriments = /^\d{2,3}-\d+$/;
    console.log(requeriments.test(number));
    return requeriments.test(number);
};
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator: numberValidator,
            message: (props) =>
                `${props.value} is not a valid phone number! gil`,
        },
        require: true,
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
