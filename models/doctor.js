const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    urlToImage: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    available: {
        type: String,
        required: true
    },
    specialized: {
        type: String,
        required: true
    }
})

const Listing = mongoose.model("Listing", doctorSchema);
module.exports = Listing;