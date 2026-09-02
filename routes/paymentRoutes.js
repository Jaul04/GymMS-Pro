const express = require("express");

const router = express.Router();

const paymentController =
    require("../controllers/paymentController");

const receiptController =
    require("../controllers/receiptController");

// ==================================
// CREATE RAZORPAY ORDER
// ==================================

router.post(
    "/create-order",
    paymentController.createOrder
);

// ==================================
// VERIFY RAZORPAY PAYMENT
// ==================================

router.post(
    "/verify",
    paymentController.verifyPayment
);

// ==================================
// ADD OFFLINE PAYMENT
// ==================================

router.post(
    "/add",
    paymentController.addOfflinePayment
);

// ==================================
// GET ALL PAYMENTS
// ==================================

router.get(
    "/all",
    paymentController.getAllPayments
);

// ==================================
// DOWNLOAD PAYMENT RECEIPT
// ==================================

router.get(
    "/receipt/:id",
    receiptController.downloadReceipt
);

module.exports = router;
