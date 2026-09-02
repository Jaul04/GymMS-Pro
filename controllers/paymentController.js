require("dotenv").config();

const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../models/Payment");
const Member = require("../models/Member");

const {
    createReceiptPdf
} = require("./receiptController");

const sendPaymentReceipt =
    require("../utils/sendPaymentReceipt");


const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET

});


exports.createOrder = async (req, res) => {

    try {

        const amount = Number(req.body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });

        }

        const order = await razorpay.orders.create({

            amount: Math.round(amount * 100),

            currency: "INR",

            receipt: "GYMMS_" + Date.now()

        });

        res.json({
            success: true,
            order
        });

    } catch (error) {

        console.log("CREATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


exports.verifyPayment = async (req, res) => {

    try {

        const {
            paymentResponse,
            memberData
        } = req.body;

        if (!paymentResponse || !memberData) {

            return res.status(400).json({
                success: false,
                message: "Payment data missing"
            });

        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = paymentResponse;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message: "Incomplete Razorpay response"
            });

        }

        
        const body =
            `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");

        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });

        }

        
        const member = await Member.findOne({
            email: memberData.email
        });

        if (!member) {

            return res.status(404).json({
                success: false,
                message: "Member not found"
            });

        }

       
        const existingPayment =
            await Payment.findOne({
                razorpayPaymentId: razorpay_payment_id
            });

        if (existingPayment) {

            return res.json({

                success: true,

                message: "Payment already verified",

                paymentId: existingPayment.paymentId,

                razorpayPaymentId:
                    existingPayment.razorpayPaymentId,

                paymentDate: existingPayment.paymentDate,

                amount: existingPayment.amount,

                plan: existingPayment.plan,

                paymentMethod: existingPayment.paymentMode,

                paymentStatus: existingPayment.paymentStatus,

                receiptUrl:
                    existingPayment.receiptUrl ||
                    `/payment/receipt/${existingPayment._id}`,

                member

            });

        }

        
        member.paymentStatus = "Paid";
        member.status = "Active";
        member.paymentMethod = "Razorpay";
        member.transactionId = razorpay_payment_id;

        await member.save();

       
        const payment = await Payment.create({

            // Explicitly provide paymentId.
            // This fixes the existing paymentId_1 unique-index error.
            paymentId:
                `PAY${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`,

            memberId: member._id,

            memberName: member.name,

            memberEmail: member.email,

            memberPhone: member.phone,

            plan: member.plan,

            amount: Number(
                member.amount ||
                memberData.amount ||
                0
            ),

            paymentMode: "Razorpay",

            source: "Online",

            paymentStatus: "Paid",

            razorpayOrderId: razorpay_order_id,

            razorpayPaymentId: razorpay_payment_id,

            razorpaySignature: razorpay_signature,

            paymentDate: new Date()

        });

        console.log(
            "ONLINE PAYMENT SAVED:",
            payment.paymentId
        );

       
        let receiptUrl =
            `/payment/receipt/${payment._id}`;

        try {

            const receiptPath =
                await createReceiptPdf(payment);

            // Public route for the member after payment.
            receiptUrl =
                `/payment/receipt/${payment._id}`;

            payment.receiptUrl = receiptUrl;

            await payment.save();

           
            await sendPaymentReceipt({

                name: member.name,

                email: member.email,

                plan: member.plan,

                amount: payment.amount,

                transactionId: razorpay_payment_id,

                joinDate: member.joinDate,

                expiryDate: member.expiryDate,

                receiptPath: receiptPath

            });

        } catch (receiptError) {

           
            console.log(
                "RECEIPT/EMAIL ERROR:",
                receiptError.message
            );

        }

      
        return res.json({

            success: true,

            message: "Payment Successful",

            paymentId: payment.paymentId,

            razorpayPaymentId:
                payment.razorpayPaymentId,

            paymentDate: payment.paymentDate,

            amount: payment.amount,

            plan: payment.plan,

            paymentMethod: payment.paymentMode,

            paymentStatus: payment.paymentStatus,

            receiptUrl,

            member

        });

    } catch (error) {

        console.log(
            "VERIFY PAYMENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Server Error"

        });

    }

};


exports.addOfflinePayment = async (req, res) => {

    try {

        const {
            memberId,
            memberName,
            memberEmail,
            memberPhone,
            plan,
            amount,
            paymentMode
        } = req.body;

        const payment = await Payment.create({

            paymentId:
                `PAY${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`,

            memberId,

            memberName,

            memberEmail,

            memberPhone,

            plan,

            amount: Number(amount),

            paymentMode,

            source: "Offline",

            paymentStatus: "Paid"

        });

        res.json({

            success: true,

            message: "Offline Payment Added",

            payment

        });

    } catch (error) {

        console.log(
            "OFFLINE PAYMENT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


exports.getAllPayments = async (req, res) => {

    try {

        const payments = await Payment.find()
            .sort({
                paymentDate: -1
            });

        res.json({

            success: true,

            payments

        });

    } catch (error) {

        console.log(
            "GET PAYMENTS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.updatePayment = async (req, res) => {

    try {

        const payment =
            await Payment.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found"

            });

        }

        res.json({

            success: true,

            message: "Payment updated successfully",

            payment

        });

    } catch (error) {

        console.log(
            "UPDATE PAYMENT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.deletePayment = async (req, res) => {

    try {

        const payment =
            await Payment.findByIdAndDelete(
                req.params.id
            );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found"

            });

        }

        res.json({

            success: true,

            message: "Payment deleted successfully"

        });

    } catch (error) {

        console.log(
            "DELETE PAYMENT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
