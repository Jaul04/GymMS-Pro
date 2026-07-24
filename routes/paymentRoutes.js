const express = require("express");

const router = express.Router();


const path = require("path");


const paymentController =
require("../controllers/paymentController");



console.log("✅ Payment Routes Loaded");


router.get("/",(req,res)=>{


    res.sendFile(

        path.join(

            __dirname,

            "..",

            "views",

            "payments.html"

        )

    );


});

router.post(
    "/add",
    paymentController.addPayment
);



router.get(
    "/all",
    paymentController.getAllPayments
);



router.get(
    "/:id",
    paymentController.getPaymentById
);


router.put(
    "/update/:id",
    paymentController.updatePayment
);


router.delete(
    "/delete/:id",
    paymentController.deletePayment
);





module.exports = router;