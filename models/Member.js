const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({

    memberId: {

        type: String,
        required: true,
        unique: true

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


    plan: {

        type: String,
        required: true

    },


    joinDate: {

        type: Date,
        required: true

    },


    expiryDate: {

        type: Date,
        required: true

    },


    status: {

        type: String,
        default: "Active"

    },

    reminderSent: {

        type: Boolean,

        default: false

    }


},{

    timestamps:true

});



module.exports =
mongoose.model(
    "Member",
    memberSchema
);