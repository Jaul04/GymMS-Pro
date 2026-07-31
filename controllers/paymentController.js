const Payment = require("../models/Payment");
const Razorpay = require("razorpay");

const {
    generateReceipt
} = require("./receiptController");


const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET

});



// ===============================
// CREATE RAZORPAY ORDER
// ===============================

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


    }


    catch(error){


        console.log("Create Order Error:",error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};





// ===============================
// ADD PAYMENT
// ===============================

const addPayment = async (req,res)=>{


    try{


        const count = await Payment.countDocuments();



        const payment = new Payment({



            paymentId:

                "PAY" +

                String(count + 1).padStart(3,"0"),



            memberId:

                req.body.memberId || null,



            memberName:

                req.body.memberName,



            memberEmail:

                req.body.memberEmail,



            memberPhone:

                req.body.memberPhone,



            plan:

                req.body.plan,



            amount:

                req.body.amount,



            paymentDate:

                req.body.paymentDate,



            method:

                req.body.method,



            transactionId:

                req.body.transactionId,



            status:

                req.body.status || "Completed"



        });



        await payment.save();





        // ===============================
        // GENERATE RECEIPT PDF
        // ===============================


        const receiptPath = await generateReceipt({


            name: payment.memberName,


            email: payment.memberEmail,


            plan: payment.plan,


            amount: payment.amount,


            paymentId: payment.paymentId


        });





        res.status(201).json({


            success:true,


            message:"Payment Added Successfully",


            receipt:receiptPath,


            payment


        });



    }



    catch(error){


        console.log("Add Payment Error:",error);



        res.status(500).json({


            success:false,


            message:error.message


        });


    }


};






// ===============================
// GET ALL PAYMENTS
// ===============================


const getAllPayments = async(req,res)=>{


    try{


        const payments = await Payment.find()

        .sort({

            createdAt:-1

        });



        res.json({


            success:true,


            payments


        });


    }


    catch(error){


        res.status(500).json({


            success:false,


            message:error.message


        });


    }


};






// ===============================
// GET PAYMENT BY ID
// ===============================


const getPaymentById = async(req,res)=>{


    try{


        const payment = await Payment.findById(

            req.params.id

        );



        if(!payment){


            return res.status(404).json({


                success:false,


                message:"Payment Not Found"


            });


        }



        res.json({


            success:true,


            payment


        });



    }


    catch(error){


        res.status(500).json({


            success:false,


            message:error.message


        });


    }


};







// ===============================
// UPDATE PAYMENT
// ===============================


const updatePayment = async(req,res)=>{


    try{


        const payment = await Payment.findByIdAndUpdate(


            req.params.id,


            {


                memberName:req.body.memberName,


                memberEmail:req.body.memberEmail,


                memberPhone:req.body.memberPhone,


                plan:req.body.plan,


                amount:req.body.amount,


                paymentDate:req.body.paymentDate,


                method:req.body.method,


                transactionId:req.body.transactionId,


                status:req.body.status


            },



            {


                new:true


            }



        );



        if(!payment){


            return res.status(404).json({


                success:false,


                message:"Payment Not Found"


            });


        }



        res.json({


            success:true,


            message:"Payment Updated Successfully",


            payment


        });



    }


    catch(error){


        res.status(500).json({


            success:false,


            message:error.message


        });


    }


};








// ===============================
// DELETE PAYMENT
// ===============================


const deletePayment = async(req,res)=>{


    try{


        const payment = await Payment.findByIdAndDelete(


            req.params.id


        );



        if(!payment){


            return res.status(404).json({


                success:false,


                message:"Payment Not Found"


            });


        }



        res.json({


            success:true,


            message:"Payment Deleted Successfully"


        });



    }


    catch(error){


        res.status(500).json({


            success:false,


            message:error.message


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