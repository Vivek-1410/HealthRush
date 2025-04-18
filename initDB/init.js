const mongoose = require("mongoose");
const initData = require("./doctorData.js");
const Listing = require("../models/doctor.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/doctorDB";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then((res) => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    })


async function initDB () {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized.");
}

initDB();