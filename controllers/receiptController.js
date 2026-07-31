const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


function generateReceipt(paymentData){

    return new Promise((resolve,reject)=>{


        const receiptDir = path.join(__dirname,"../receipts");


        if(!fs.existsSync(receiptDir)){
            fs.mkdirSync(receiptDir);
        }


        const fileName =
        `Receipt_${paymentData.paymentId}.pdf`;


        const filePath =
        path.join(receiptDir,fileName);



        const doc = new PDFDocument();


        doc.pipe(
            fs.createWriteStream(filePath)
        );


        doc.fontSize(20)
        .text("GymMS Pro",{
            align:"center"
        });


        doc.moveDown();


        doc.fontSize(16)
        .text("Payment Receipt",{
            align:"center"
        });



        doc.moveDown(2);



        doc.fontSize(12)
        .text(
`Receipt Details

Member Name: ${paymentData.name}

Email: ${paymentData.email}

Plan: ${paymentData.plan}

Amount Paid: ₹${paymentData.amount}

Payment ID: ${paymentData.paymentId}

Payment Status: SUCCESS

Payment Date: ${new Date().toDateString()}

--------------------------------

Thank you for joining GymMS Pro`
        );


        doc.end();



        doc.on("finish",()=>{
            resolve(filePath);
        });


        doc.on("error",(err)=>{
            reject(err);
        });


    });

}


module.exports = {
    generateReceipt
};