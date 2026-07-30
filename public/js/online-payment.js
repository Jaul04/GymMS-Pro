// GymMS Pro Online Payment JS


document.addEventListener("DOMContentLoaded", () => {


    const memberData = JSON.parse(
        localStorage.getItem("gymMember")
    );


    if(!memberData){

        alert("Registration data not found.");

        window.location.href="/register";

        return;

    }



    // Display Member Data

    document.getElementById("name").innerText =
        memberData.name;


    document.getElementById("email").innerText =
        memberData.email;


    document.getElementById("phone").innerText =
        memberData.phone;


    document.getElementById("plan").innerText =
        memberData.plan;



    let amount = 0;



    // Plan Amount

    if(memberData.plan === "Monthly"){

        amount = 999;

    }

    else if(memberData.plan === "Quarterly"){

        amount = 2500;

    }

    else if(memberData.plan === "Half-Yearly"){

        amount = 5000;

    }

    else if(memberData.plan === "Yearly"){

        amount = 9000;

    }



    document.getElementById("amount").innerText =
        "₹" + amount;



    // Payment Button


    document
    .getElementById("payBtn")
    .onclick = function(){



        let options = {


            key:
            "YOUR_RAZORPAY_KEY",


            amount:
            amount * 100,


            currency:
            "INR",


            name:
            "GymMS Pro",


            description:
            "Gym Membership Payment",



            handler:
            function(response){


                verifyPayment(
                    response,
                    memberData,
                    amount
                );


            },


            prefill:{


                name:
                memberData.name,


                email:
                memberData.email,


                contact:
                memberData.phone


            },


            theme:{


                color:
                "#0d6efd"


            }


        };



        let rzp =
        new Razorpay(options);



        rzp.open();


    };



});




// VERIFY PAYMENT FUNCTION


function verifyPayment(
    paymentResponse,
    memberData,
    amount
){



    let today = new Date();



    let joinDateFormat =
    today.toISOString()
    .split("T")[0];



    let expiry =
    new Date(today);



    expiry.setMonth(
        expiry.getMonth()+1
    );



    let expiryDateFormat =
    expiry.toISOString()
    .split("T")[0];





    const paymentData = {



        name:
        memberData.name,



        email:
        memberData.email,



        phone:
        memberData.phone,



        plan:
        memberData.plan,



        amount:
        amount,



        paymentId:
        paymentResponse.razorpay_payment_id,



        paymentMethod:
        "Razorpay",



        joinDate:
        joinDateFormat,



        expiryDate:
        expiryDateFormat



    };





    console.log(
        "FINAL RECEIPT DATA:",
        paymentData
    );





    localStorage.setItem(

        "paymentData",

        JSON.stringify(paymentData)

    );





    window.location.href =
    "/payment-success";



}