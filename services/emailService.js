const axios = require("axios");

require("dotenv").config();



const sendExpiryReminder = async (member) => {


    try {


        await axios.post(

            "https://api.brevo.com/v3/smtp/email",


            {

                sender: {

                    name: process.env.BREVO_NAME,

                    email: process.env.BREVO_EMAIL

                },


                to: [

                    {

                        email: member.email,

                        name: member.name

                    }

                ],


                subject: "Gym Membership Expiry Reminder",


                htmlContent: `

                <h2>GymMS Pro</h2>


                <p>Hello <b>${member.name}</b>,</p>


                <p>Your gym membership is going to expire soon.</p>


                <p>

                <b>Plan:</b> ${member.plan}

                <br>

                <b>Expiry Date:</b>

                ${new Date(member.expiryDate).toDateString()}

                </p>


                <p>

                Please renew your membership before expiry.

                </p>


                <br>


                <p>

                Thank You,<br>

                <b>GymMS Pro Team</b>

                </p>

                `

            },


            {

                headers: {

                    "api-key": process.env.BREVO_API_KEY,

                    "Content-Type": "application/json"

                }

            }


        );



        console.log(
            "Email Sent Successfully:",
            member.email
        );


        // Important for cron-job.org
        return true;



    }


    catch(error){


        console.log(

            "Brevo Email Error:",

            error.response?.data || error.message

        );


        throw error;


    }



};



module.exports = sendExpiryReminder;