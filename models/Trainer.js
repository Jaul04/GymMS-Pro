const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
    trainerId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, default: "" },
    dob: { type: Date, default: null },
    address: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    bio: { type: String, default: "" },
    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 },
    salary: { type: Number, default: 0 },
    status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("Trainer", trainerSchema);
