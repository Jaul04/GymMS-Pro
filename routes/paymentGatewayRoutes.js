const express = require("express");
const router = express.Router();

const Razorpay = require("razorpay");
const crypto = require("crypto");

const Member = require("../models/Member");
const Payment = require("../models/Payment");

const sendPaymentReceipt =
require("../utils/sendPaymentReceipt");



const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET

});




// =========================
// CREATE ORDER
// =========================

router.post("/create-order", async(req,res)=>{

    try{

        const amount = Number(req.body.amount);


        const options={

            amount: amount * 100,

            currency:"INR",

            receipt:
            "gymmspro_" + Date.now()

        };


        const order =
        await razorpay.orders.create(options);


        res.json(order);


    }
    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

});







// =========================
// VERIFY PAYMENT
// =========================


router.post("/verify",async(req,res)=>{


try{


const paymentResponse =
req.body.paymentResponse;


const memberData =
req.body.memberData;



const body =

paymentResponse.razorpay_order_id

+

"|"

+

paymentResponse.razorpay_payment_id;



const expectedSignature =

crypto

.createHmac(

"sha256",

process.env.RAZORPAY_KEY_SECRET

)

.update(body)

.digest("hex");




if(expectedSignature !== paymentResponse.razorpay_signature)

{

return res.json({

success:false,

message:"Payment Verification Failed"

});

}





// =========================
// UPDATE MEMBER
// =========================


const member =

await Member.findOneAndUpdate(

{

email:memberData.email

},

{

paymentStatus:"Paid",

paymentMethod:"Razorpay",

transactionId:
paymentResponse.razorpay_payment_id,

status:"Active"

},

{

new:true

}

);





if(!member)

{

return res.json({

success:false,

message:"Member not found"

});

}





// =========================
// SAVE PAYMENT
// =========================


const count =
await Payment.countDocuments();



const payment = new Payment({


paymentId:

"PAY"+

String(count+1).padStart(3,"0"),



memberId:

member._id,



memberName:

member.name,



amount:

memberData.amount,



paymentDate:

new Date(),



method:

"Razorpay",



status:

"Completed",



transactionId:

paymentResponse.razorpay_payment_id


});




await payment.save();




// =========================
// SEND PAYMENT RECEIPT EMAIL
// =========================


await sendPaymentReceipt({

    name: member.name,

    email: member.email,

    plan: member.plan,

    amount: memberData.amount,

    transactionId:
    paymentResponse.razorpay_payment_id,

    joinDate:
    member.joinDate,

    expiryDate:
    member.expiryDate

});




// =========================
// RESPONSE
// =========================


res.json({

success:true,

message:"Payment Successful & Receipt Sent",

paymentId:
paymentResponse.razorpay_payment_id,

member:member

});



}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}


});





module.exports = router;