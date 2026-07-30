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
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        default: ""
    },

    dob: {
        type: Date,
        default: null
    },

    address: {
        type: String,
        default: ""
    },

    emergencyContact: {
        type: String,
        default: ""
    },

    plan: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        default: 0
    },

    joinDate: {
        type: Date,
        required: true
    },

    expiryDate: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: ["Pending", "Active", "Expired"],
        default: "Pending"
    },

    reminderSent: {
        type: Boolean,
        default: false
    },

    registrationType: {
        type: String,
        enum: ["Online", "Offline"],
        default: "Offline"
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    paymentMethod: {
        type: String,
        default: ""
    },

    transactionId: {
        type: String,
        default: ""
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Member", memberSchema);