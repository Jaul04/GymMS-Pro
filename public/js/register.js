const registerForm = document.getElementById("registerForm");

const planSelect = document.getElementById("plan");
const amountInput = document.getElementById("amount");
const joinDateInput = document.getElementById("joinDate");
const expiryDateInput = document.getElementById("expiryDate");

// ==============================
// Today's Date
// ==============================

const today = new Date();

joinDateInput.value = today.toISOString().split("T")[0];

// ==============================
// Update Plan Details
// ==============================

planSelect.addEventListener("change", updatePlanDetails);

function updatePlanDetails() {

    const plan = planSelect.value;

    let amount = 0;

    let days = 0;

    switch (plan) {

        case "Monthly":

            amount = 999;
            days = 30;
            break;

        case "Quarterly":

            amount = 2500;
            days = 90;
            break;

        case "Half-Yearly":

            amount = 5000;
            days = 180;
            break;

        case "Yearly":

            amount = 9000;
            days = 365;
            break;

        default:

            amount = 0;
            days = 0;

    }

    amountInput.value = amount;

    if (days > 0) {

        const expiry = new Date();

        expiry.setDate(expiry.getDate() + days);

        expiryDateInput.value =
            expiry.toISOString().split("T")[0];

    } else {

        expiryDateInput.value = "";

    }

}

// ==============================
// Register Form Submit
// ==============================

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const member = {

        name:
        document.getElementById("name").value.trim(),

        email:
        document.getElementById("email").value.trim(),

        phone:
        document.getElementById("phone").value.trim(),

        gender:
        document.getElementById("gender").value,

        dob:
        document.getElementById("dob").value,

        address:
        document.getElementById("address").value.trim(),

        emergencyContact:
        document.getElementById("emergencyContact").value.trim(),

        plan:
        planSelect.value,

        amount:
        Number(amountInput.value),

        joinDate:
        joinDateInput.value,

        expiryDate:
        expiryDateInput.value

    };

    if (

        !member.name ||
        !member.email ||
        !member.phone ||
        !member.gender ||
        !member.dob ||
        !member.address ||
        !member.emergencyContact ||
        !member.plan

    ) {

        alert("Please fill all fields.");

        return;

    }

    const btn = document.querySelector(".register-btn");

    btn.disabled = true;

    btn.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        Registering...
    `;
        try {

        const response = await fetch("/members/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(member)

        });

        const data = await response.json();

        if (data.success) {

            // Save data for payment page

            localStorage.setItem(
                "gymMember",
                JSON.stringify(member)
            );

            alert("Registration Successful!");

            // Redirect to payment page

            window.location.href = "/online-payment";

        } else {

            alert(
                data.message || "Registration Failed"
            );

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

    finally {

        btn.disabled = false;

        btn.innerHTML = `

            <i class="fa-solid fa-dumbbell"></i>

            Register & Continue to Payment

        `;

    }

});