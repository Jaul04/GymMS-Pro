const API = "/payments";
const RAZORPAY_KEY = "rzp_test_THIcfQCF46SWLm";

let payments = [];
let editId = null;
let revenueChart = null;

const paymentTable = document.getElementById("paymentTable");
const memberSelect = document.getElementById("memberName");
const paymentForm = document.getElementById("paymentForm");

const totalRevenue = document.getElementById("totalRevenue");
const todayRevenue = document.getElementById("todayRevenue");
const paymentCount = document.getElementById("paymentCount");
const upiCount = document.getElementById("upiCount");

const searchPayment = document.getElementById("searchPayment");
const paymentFilter = document.getElementById("paymentFilter");

window.addEventListener("DOMContentLoaded", () => {

    loadPayments();
    loadMembers();

});

async function loadPayments() {

    try {

        const res = await fetch(`${API}/all`);

        payments = await res.json();

        displayPayments(payments);

        updateStats(payments);

        createRevenueChart();

    }

    catch (err) {

        console.log(err);

    }

}

function displayPayments(data) {

    paymentTable.innerHTML = "";

    if (data.length === 0) {

        paymentTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                No Payments Available
            </td>
        </tr>
        `;

        return;

    }

    data.forEach((payment, index) => {

        let badge = "card-badge";

        if (payment.method === "Cash")
            badge = "cash-badge";

        if (payment.method === "UPI")
            badge = "upi-badge";

        paymentTable.innerHTML += `

        <tr>

            <td>#${index + 1}</td>

            <td>

                <div class="d-flex align-items-center">

                    <div class="member-avatar">

                        ${payment.memberName.charAt(0).toUpperCase()}

                    </div>

                    ${payment.memberName}

                </div>

            </td>

            <td>₹${payment.amount}</td>

            <td>

                ${new Date(payment.paymentDate).toLocaleDateString("en-IN")}

            </td>

            <td>

                <span class="method-badge ${badge}">

                    ${payment.method}

                </span>

            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editPayment('${payment._id}')">

                    <i class="fa fa-edit"></i>

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deletePayment('${payment._id}')">

                    <i class="fa fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

function updateStats(data) {

    let total = 0;
    let today = 0;
    let upi = 0;

    const todayDate = new Date().toISOString().split("T")[0];

    data.forEach(payment => {

        total += Number(payment.amount);

        if (payment.method === "UPI")
            upi++;

        const date = new Date(payment.paymentDate)
            .toISOString()
            .split("T")[0];

        if (date === todayDate)
            today += Number(payment.amount);

    });

    totalRevenue.innerText = "₹" + total;
    todayRevenue.innerText = "₹" + today;
    paymentCount.innerText = data.length;
    upiCount.innerText = upi;

}
paymentForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const payment = {

        memberName: document.getElementById("memberName").value,

        amount: document.getElementById("amount").value,

        paymentDate: document.getElementById("paymentDate").value,

        method: document.getElementById("paymentMethod").value,

        status: "Completed"

    };

    if (editId) {

        try {

            const res = await fetch(`${API}/update/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payment)

            });

            if (res.ok) {

                alert("Payment Updated Successfully");

                bootstrap.Modal.getInstance(
                    document.getElementById("paymentModal")
                ).hide();

                resetPaymentForm();

                loadPayments();

            }

        }

        catch (err) {

            console.log(err);

        }

        return;

    }

    if (payment.method === "Cash") {

        try {

            const res = await fetch(`${API}/add`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payment)

            });

            if (res.ok) {

                alert("Cash Payment Added Successfully");

                bootstrap.Modal.getInstance(
                    document.getElementById("paymentModal")
                ).hide();

                resetPaymentForm();

                loadPayments();

            }

        }

        catch (err) {

            console.log(err);

        }

        return;

    }

    try {

        const orderResponse = await fetch(`${API}/create-order`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                amount: payment.amount

            })

        });

        const data = await orderResponse.json();

        if (!data.success) {

            alert("Unable to create Razorpay order");

            return;

        }

        const options = {

            key: RAZORPAY_KEY,

            amount: data.order.amount,

            currency: data.order.currency,

            name: "GymMS Pro",

            description: "Gym Membership Payment",

            order_id: data.order.id,

            handler: async function (response) {

                payment.razorpayPaymentId = response.razorpay_payment_id;
                payment.razorpayOrderId = response.razorpay_order_id;
                payment.status = "Completed";

                const save = await fetch(`${API}/add`, {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(payment)

                });

                if (save.ok) {

                    alert("Payment Successful");

                    bootstrap.Modal.getInstance(
                        document.getElementById("paymentModal")
                    ).hide();

                    resetPaymentForm();

                    loadPayments();

                }

            },

            prefill: {

                name: payment.memberName

            },

            theme: {

                color: "#0d6efd"

            }

        };

        const rzp = new Razorpay(options);

        rzp.open();

    }

    catch (err) {

        console.log(err);

        alert("Payment Failed");

    }

});

async function editPayment(id) {

    const res = await fetch(`${API}/${id}`);

    const payment = await res.json();

    editId = id;

    document.getElementById("memberName").value = payment.memberName;
    document.getElementById("amount").value = payment.amount;
    document.getElementById("paymentDate").value =
        new Date(payment.paymentDate).toISOString().split("T")[0];
    document.getElementById("paymentMethod").value = payment.method;

    document.querySelector(".modal-header h4").innerHTML = `
        <i class="fa fa-edit"></i>
        Edit Payment
    `;

    new bootstrap.Modal(
        document.getElementById("paymentModal")
    ).show();

}

async function deletePayment(id) {

    if (!confirm("Delete this payment?"))
        return;

    await fetch(`${API}/delete/${id}`, {

        method: "DELETE"

    });

    loadPayments();

} 

function resetPaymentForm() {

    editId = null;

    paymentForm.reset();

    document.querySelector(".modal-header h4").innerHTML = `
        <i class="fa-solid fa-money-check-dollar"></i>
        Add Payment
    `;

    document.getElementById("paymentDate").value =
        new Date().toISOString().split("T")[0];

}

async function loadMembers() {

    try {

        const res = await fetch("/members/all");

        const members = await res.json();

        memberSelect.innerHTML = `
            <option value="">Select Member</option>
        `;

        members.forEach(member => {

            memberSelect.innerHTML += `
                <option value="${member.name}">
                    ${member.name}
                </option>
            `;

        });

    }

    catch (err) {

        console.log(err);

    }

}

