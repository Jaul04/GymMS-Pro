require("dotenv").config();

const Payment = require("../models/Payment");
const Member = require("../models/Member");
const Razorpay = require("razorpay");
const crypto = require("crypto");

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

const createOrder = async(req,res)=>{


try{


const {amount}=req.body;


if(!amount){

return res.json({

success:false,

message:"Amount required"

});

}



const order = await razorpay.orders.create({

amount:Number(amount)*100,

currency:"INR",

receipt:"GYMMS_"+Date.now()

});



res.json({

success:true,

order

});


}


catch(error){


console.log(
"CREATE ORDER ERROR:",
error
);


res.status(500).json({

success:false,

message:error.message

});


}


};







// ===============================
// VERIFY ONLINE PAYMENT
// ===============================

const verifyPayment = async(req,res)=>{


try{


const {

paymentResponse,

memberData

}=req.body;



// VERIFY SIGNATURE


const body =

paymentResponse.razorpay_order_id

+

"|"

+

paymentResponse.razorpay_payment_id;



const expectedSignature = crypto

.createHmac(

"sha256",

process.env.RAZORPAY_KEY_SECRET

)

.update(body)

.digest("hex");





if(expectedSignature !== paymentResponse.razorpay_signature){


return res.json({

success:false,

message:"Invalid Signature"

});


}





// ===============================
// FIND MEMBER USING ID
// ===============================


let member = await Member.findById(

memberData._id

);





// IF MEMBER NOT FOUND CREATE

if(!member){


member = await Member.create({


name:memberData.name,

email:memberData.email,

phone:memberData.phone,

plan:memberData.plan,

amount:Number(memberData.amount),

status:"Pending",

paymentStatus:"Pending",

registrationType:"Online"

});


}







// UPDATE MEMBER


member.status="Active";

member.paymentStatus="Paid";

member.paymentMethod="Razorpay";

member.transactionId =
paymentResponse.razorpay_payment_id;


await member.save();







// SAVE PAYMENT


const payment = await Payment.create({


memberId:member._id,

memberName:member.name,

memberEmail:member.email,

memberPhone:member.phone,

plan:member.plan,

amount:Number(member.amount),


paymentMode:"Razorpay",

source:"Online",

paymentStatus:"Paid",


razorpayOrderId:
paymentResponse.razorpay_order_id,


razorpayPaymentId:
paymentResponse.razorpay_payment_id,


razorpaySignature:
paymentResponse.razorpay_signature


});







console.log(

"ONLINE PAYMENT SAVED:",

payment._id

);





res.json({

success:true,

message:"Payment Successful",

payment

});




}


catch(error){


console.log(

"VERIFY ERROR:",

error

);


res.status(500).json({

success:false,

message:error.message

});


}


};










// ===============================
// ADD OFFLINE PAYMENT
// ===============================


const addPayment = async(req,res)=>{


try{


const payment = await Payment.create({

memberId:req.body.memberId || null,

memberName:req.body.memberName,

memberEmail:req.body.memberEmail,

memberPhone:req.body.memberPhone,

plan:req.body.plan,

amount:Number(req.body.amount),

paymentMode:req.body.paymentMode || "Cash",

source:"Offline",

paymentStatus:"Paid"

});




res.json({

success:true,

message:"Payment Added Successfully",

payment

});


}


catch(error){


console.log(

"ADD PAYMENT ERROR:",

error

);


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








module.exports = {


createOrder,

verifyPayment,

addPayment,

getAllPayments


};
