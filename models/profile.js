const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    gender : String,

    height : {
        type : Number,
        required : true,
    },


    weight : {
        type : Number,
        required  :true,
    },

    issues : {
        type : String,
        required : true,

    },
    bmi : {
        type : Number,
        
    },

    fitnessLevel: {
        type: String,
        required: true
    },
    image: {
        type: String
    }


})

const Profile = mongoose.model("Profile",profileSchema);

module.exports = Profile