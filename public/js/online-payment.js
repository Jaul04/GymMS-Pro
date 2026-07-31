document.addEventListener("DOMContentLoaded", () => {

    const memberData = JSON.parse(localStorage.getItem("gymMember"));

    if (!memberData) {
        alert("Registration data not found.");
        window.location.href = "/register";
        return;
    }

    // ===========================
    // Show Member Details
    // ===========================

    document.getElementById("name").innerText = memberData.name;
    document.getElementById("email").innerText = memberData.email;
    document.getElementById("plan").innerText = memberData.plan;
    document.getElementById("amount").innerText = "₹" + memberData.amount;

    const amount = Number(memberData.amount);

    // ===========================
    // Pay Button
    // ===========================

    document.getElementById("payButton").addEventListener("click", function () {

        const options = {

            key: "rzp_live_THJJ0lbmFICoWk",

            amount: amount * 100,

            currency: "INR",

            name: "GymMS Pro",

            description: "Gym Membership Payment",

            handler: async function (response) {

                try {

                    const payment = {

                        memberName: memberData.name,

                        memberEmail: memberData.email,

                        memberPhone: memberData.phone,

                        memberId: memberData._id,

                        amount: amount,

                        paymentDate: new Date(),

                        method: "Razorpay",

                        status: "Completed",

                        transactionId: response.razorpay_payment_id

                    };

                    const save = await fetch("/payments/add", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(payment)

                    });

                    const result = await save.json();

                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    localStorage.setItem("paymentData", JSON.stringify({

                        name: memberData.name,

                        email: memberData.email,

                        phone: memberData.phone,

                        plan: memberData.plan,

                        amount: amount,

                        paymentId: response.razorpay_payment_id,

                        paymentMethod: "Razorpay",

                        joinDate: memberData.joinDate,

                        expiryDate: memberData.expiryDate

                    }));

                    alert("Payment Successful");

                    window.location.href = "/payment-success";

                }

                catch (err) {

                    console.log(err);

                    alert("Payment Save Failed");

                }

            },

            prefill: {

                name: memberData.name,

                email: memberData.email,

                contact: memberData.phone

            },

            theme: {

                color: "#ffc107"

            }

        };

        const rzp = new Razorpay(options);

        rzp.open();

    });

});