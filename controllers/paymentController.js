const Payment = require("../models/Payment");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {

    try {

        const { amount } = req.body;

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {

        console.log("Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const addPayment = async (req, res) => {

    try {

        const count = await Payment.countDocuments();

        const payment = new Payment({

            paymentId:
                "PAY" +
                String(count + 1).padStart(3, "0"),

            memberId: req.body.memberId || null,

            memberName: req.body.memberName,

            amount: req.body.amount,

            paymentDate: req.body.paymentDate,

            method: req.body.method,

            status: req.body.status || "Completed"

        });

        await payment.save();

        res.status(201).json({

            success: true,

            message: "Payment Added Successfully",

            payment

        });

    }

    catch (error) {

        console.log("Add Payment Error:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getAllPayments = async (req, res) => {

    try {

        const payments = await Payment.find().sort({
            createdAt: -1
        });

        res.json(payments);

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getPaymentById = async (req, res) => {

    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment Not Found"

            });

        }

        res.json(payment);

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const updatePayment = async (req, res) => {

    try {

        const payment = await Payment.findByIdAndUpdate(

            req.params.id,

            {

                memberName: req.body.memberName,

                amount: req.body.amount,

                paymentDate: req.body.paymentDate,

                method: req.body.method,

                status: req.body.status

            },

            {
                new: true
            }

        );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment Not Found"

            });

        }

        res.json({

            success: true,

            message: "Payment Updated Successfully",

            payment

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const deletePayment = async (req, res) => {

    try {

        const payment = await Payment.findByIdAndDelete(req.params.id);

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment Not Found"

            });

        }

        res.json({

            success: true,

            message: "Payment Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    createOrder,

    addPayment,

    getAllPayments,

    getPaymentById,

    updatePayment,

    deletePayment

};