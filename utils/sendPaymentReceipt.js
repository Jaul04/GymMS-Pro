const axios = require("axios");
const fs = require("fs");

const sendPaymentReceipt = async (data) => {

    try {

        // ===========================
        // PDF to Base64
        // ===========================

        let attachments = [];

        if (data.receiptPath && fs.existsSync(data.receiptPath)) {

            const file = fs.readFileSync(data.receiptPath);

            attachments.push({

                name: "GymMS_Receipt.pdf",

                content: file.toString("base64")

            });

        }

        await axios.post(

            "https://api.brevo.com/v3/smtp/email",

            {

                sender: {

                    name: process.env.BREVO_NAME,

                    email: process.env.BREVO_EMAIL

                },

                to: [

                    {

                        email: data.email,

                        name: data.name

                    }

                ],

                subject: "GymMS Pro Payment Receipt",

                htmlContent: `

                <h2>GymMS Pro</h2>

                <h3 style="color:green;">
                Payment Successful ✅
                </h3>

                <hr>

                <p><b>Member Name:</b> ${data.name}</p>

                <p><b>Plan:</b> ${data.plan}</p>

                <p><b>Amount:</b> ₹${data.amount}</p>

                <p><b>Payment ID:</b> ${data.transactionId}</p>

                <p><b>Payment Method:</b> Razorpay</p>

                <p><b>Join Date:</b> ${data.joinDate}</p>

                <p><b>Expiry Date:</b> ${data.expiryDate}</p>

                <hr>

                <p>
                Your payment receipt is attached with this email.
                </p>

                <p>
                Thank you for choosing GymMS Pro 💪
                </p>

                `,

                attachments: attachments

            },

            {

                headers: {

                    "api-key": process.env.BREVO_API_KEY,

                    "Content-Type": "application/json"

                }

            }

        );

        console.log("✅ Payment Receipt Email Sent");

    }
    catch (error) {

        console.log(

            "EMAIL ERROR:",

            error.response?.data || error.message

        );

    }

};

module.exports = sendPaymentReceipt;