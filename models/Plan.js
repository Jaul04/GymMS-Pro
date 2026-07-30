const mongoose = require("mongoose");


const planSchema = new mongoose.Schema({

    planId:{
        type:String,
        required:true,
        unique:true
    },


    name:{
        type:String,
        required:true
    },


    duration:{
        type:Number,
        required:true
    },


    price:{
        type:Number,
        required:true
    },


    status:{
        type:String,
        default:"Active"
    },


    createdAt:{
        type:Date,
        default:Date.now
    }


});


module.exports = mongoose.model(
    "Plan",
    planSchema
);