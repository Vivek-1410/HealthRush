const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    fever: {
        type: String,
    },
    cough: {
        type: String,
    },
    stomachPain: {
        type: String,
    },
    breathproblem: {
        type: String,
    },
    headache: {
        type: String,
    }
})

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;