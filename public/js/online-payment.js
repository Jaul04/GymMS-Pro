document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // GET MEMBER DATA
    // ==========================================

    const memberData = JSON.parse(
        localStorage.getItem("gymMember")
    );

    if (!memberData) {

        alert("Registration data not found.");

        window.location.replace("/register");

        return;

    }

    // ==========================================
    // SHOW MEMBER DETAILS
    // ==========================================

    document.getElementById("name").innerText =
        memberData.name || "-";

    document.getElementById("email").innerText =
        memberData.email || "-";

    document.getElementById("plan").innerText =
        memberData.plan || "-";

    document.getElementById("amount").innerText =
        "₹" +
        Number(memberData.amount || 0)
            .toLocaleString("en-IN");

    const amount = Number(memberData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Invalid payment amount");

        return;

    }

    const payButton =
        document.getElementById("payButton");

    // ==========================================
    // GET PUBLIC RAZORPAY KEY
    // ==========================================

    let razorpayKey = null;

    try {

        const configResponse =
            await fetch("/payment/config");

        const config =
            await configResponse.json();

        if (!config.success || !config.keyId) {

            throw new Error(
                "Razorpay key is not configured on the server."
            );

        }

        razorpayKey = config.keyId;

    } catch (error) {

        console.error(
            "RAZORPAY CONFIG ERROR:",
            error
        );

        payButton.disabled = true;

        payButton.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Payment Unavailable';

        alert(
            "Payment service is temporarily unavailable."
        );

        return;

    }

    // ==========================================
    // PAYMENT BUTTON
    // ==========================================

    payButton.addEventListener("click", async () => {

        try {

            payButton.disabled = true;

            payButton.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span> Opening Payment...';

            // ==========================================
            // CREATE ORDER
            // ==========================================

            const orderResponse = await fetch(
                "/payment/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount: amount
                    })
                }
            );

            const order = await orderResponse.json();

            console.log(
                "ORDER RESPONSE:",
                order
            );

            if (!order.success) {

                throw new Error(
                    order.message ||
                    "Unable to create payment order"
                );

            }

            // ==========================================
            // RAZORPAY OPTIONS
            // ==========================================

            const options = {

                key: razorpayKey,

                order_id: order.order.id,

                amount: order.order.amount,

                currency: order.order.currency || "INR",

                name: "Gym Pro",

                description: "Gym Membership Payment",

                prefill: {

                    name: memberData.name,

                    email: memberData.email,

                    contact: memberData.phone

                },

                notes: {

                    plan: memberData.plan,

                    memberEmail: memberData.email

                },

                theme: {

                    color: "#ffc107"

                },

                handler: async function (response) {

                    try {

                        console.log(
                            "RAZORPAY RESPONSE:",
                            response
                        );

                        payButton.innerHTML =
                            '<span class="spinner-border spinner-border-sm me-2"></span> Verifying Payment...';

                        // ==========================================
                        // VERIFY PAYMENT
                        // ==========================================

                        const verifyResponse =
                            await fetch(
                                "/payment/verify",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },
                                    body: JSON.stringify({

                                        paymentResponse:
                                            response,

                                        memberData:
                                            memberData

                                    })
                                }
                            );

                        const result =
                            await verifyResponse.json();

                        console.log(
                            "VERIFY RESULT:",
                            result
                        );

                        if (!result.success) {

                            throw new Error(
                                result.message ||
                                "Payment verification failed"
                            );

                        }

                        // ==========================================
                        // SAVE DATA FOR RECEIPT PAGE
                        // ==========================================

                        localStorage.setItem(
                            "paymentData",
                            JSON.stringify({

                                member:
                                    result.member,

                                paymentId:
                                    result.paymentId,

                                razorpayPaymentId:
                                    result.razorpayPaymentId,

                                receiptUrl:
                                    result.receiptUrl,

                                paymentMethod:
                                    "Razorpay",

                                paymentStatus:
                                    result.paymentStatus || "Paid",

                                paymentDate:
                                    result.paymentDate,

                                amount:
                                    result.amount,

                                plan:
                                    result.plan

                            })
                        );

                        // No success alert here.
                        // Go directly to the receipt page.
                        window.location.replace(
                            "/payment-success?autoprint=1"
                        );

                    } catch (error) {

                        console.error(
                            "VERIFY ERROR:",
                            error
                        );

                        payButton.disabled = false;

                        payButton.innerHTML =
                            '<i class="fa-solid fa-lock"></i> Pay Now';

                        alert(
                            error.message ||
                            "Payment verification failed"
                        );

                    }

                }

            };

            const razorpay =
                new Razorpay(options);

            razorpay.open();

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "PAYMENT FAILED:",
                        response
                    );

                    payButton.disabled = false;

                    payButton.innerHTML =
                        '<i class="fa-solid fa-lock"></i> Pay Now';

                    alert(
                        response.error?.description ||
                        "Payment Failed"
                    );

                }
            );

        } catch (error) {

            console.error(
                "PAYMENT ERROR:",
                error
            );

            payButton.disabled = false;

            payButton.innerHTML =
                '<i class="fa-solid fa-lock"></i> Pay Now';

            alert(
                error.message ||
                "Unable to start payment"
            );

        }

    });

});
