const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    // Internal GymMS payment reference.
    // This field is kept because the existing MongoDB database has
    // a unique index named paymentId_1.
    paymentId: {
        type: String,
        required: true,
        unique: true,
        default: () =>
            `PAY${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`
    },

    // Member Reference
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: false
    },

    // Member Details Snapshot
    memberName: {
        type: String,
        required: true
    },

    memberEmail: {
        type: String
    },

    memberPhone: {
        type: String
    },

    // Plan Details
    plan: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    // Payment Type
    paymentMode: {
        type: String,
        enum: ["Cash", "UPI", "Card", "Razorpay"],
        default: "Cash"
    },

    // Payment Source
    source: {
        type: String,
        enum: ["Offline", "Online"],
        default: "Offline"
    },

    // Status
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    // Razorpay Details
    razorpayOrderId: {
        type: String
    },

    razorpayPaymentId: {
        type: String
    },

    razorpaySignature: {
        type: String
    },

    // Receipt
    receiptUrl: {
        type: String
    },

    paymentDate: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);
