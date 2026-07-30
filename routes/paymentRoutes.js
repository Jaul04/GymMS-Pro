const express = require("express");
const router = express.Router();
const path = require("path");

const paymentController = require("../controllers/paymentController");

console.log("✅ Payment Routes Loaded");


// Payments Page

router.get("/", (req, res) => {

    res.sendFile(

        path.join(

            __dirname,

            "..",

            "public",

            "views",

            "payments.html"

        )

    );

});


// Create Razorpay Order

router.post(
    "/create-order",
    paymentController.createOrder
);


// Add Payment

router.post(
    "/add",
    paymentController.addPayment
);


// Get All Payments

router.get(
    "/all",
    paymentController.getAllPayments
);


// Get Payment By ID

router.get(
    "/:id",
    paymentController.getPaymentById
);


// Update Payment

router.put(
    "/update/:id",
    paymentController.updatePayment
);


// Delete Payment

router.delete(
    "/delete/:id",
    paymentController.deletePayment
);


module.exports = router;