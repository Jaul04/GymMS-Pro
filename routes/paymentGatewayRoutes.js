const express = require("express");

const router = express.Router();

const paymentController =
    require("../controllers/paymentController");

const receiptController =
    require("../controllers/receiptController");

// The project has one payment implementation.
// Keeping /payment/* as the public Razorpay gateway routes
// avoids the old duplicate implementation that was creating
// paymentId: null and calling the receipt controller incorrectly.

router.post(
    "/create-order",
    paymentController.createOrder
);

router.post(
    "/verify",
    paymentController.verifyPayment
);

// Public Razorpay key for Checkout. Secret key is never sent to the browser.
router.get("/config", (req, res) => {
    res.json({
        success: true,
        keyId: process.env.RAZORPAY_KEY_ID
    });
});

// Public receipt route for a member immediately after payment.
router.get(
    "/receipt/:id",
    receiptController.downloadReceipt
);

module.exports = router;
