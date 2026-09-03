const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, default: "admin", trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    dob: { type: Date, default: null },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
