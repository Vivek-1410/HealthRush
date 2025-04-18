const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const TrackUser = require("./tracker.js");


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    trackUser: [    
        {
            type: Schema.Types.ObjectId,
            ref: "TrackUser"
        }
    ],
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
