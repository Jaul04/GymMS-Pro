const mongoose = require("mongoose");


const trainerSchema = new mongoose.Schema({

    trainerId:{
        type:String,
        required:true,
        unique:true
    },

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    specialization:{
        type:String,
        required:true
    },

    experience:{
        type:Number,
        default:0
    },

    salary:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        default:"Active"
    }


},{
    timestamps:true
});


module.exports = mongoose.model(
    "Trainer",
    trainerSchema
);