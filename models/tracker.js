const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const trackerSchema = new Schema({
    exerciseType: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    intensity: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    caloriesBurned: {
        type: Number,
        required: true
    }
})

const TrackUser = mongoose.model("TrackUser", trackerSchema);

module.exports = TrackUser; 