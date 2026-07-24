console.log("members.js loaded");

const memberForm = document.getElementById("memberForm");

console.log("Form =", memberForm);

memberForm.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Submit Event Working");
});


const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({

    memberId:{
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

    plan:{
        type:String,
        required:true
    },

    joinDate:{
        type:Date,
        required:true
    },

    expiryDate:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        default:"Active"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Member", memberSchema);

console.log("Member Model Loaded");