const API = "/payments";
const RAZORPAY_KEY = "rzp_live_THJJ0lbmFICoWk";

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

window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("paymentDate").value =
        new Date().toISOString().split("T")[0];

    loadMembers();
    loadPayments();

});


// ===============================
// LOAD MEMBERS
// ===============================

async function loadMembers() {

    try {

        const res = await fetch("/members/all");
        const data = await res.json();

        console.log(data);

        memberSelect.innerHTML =
        `<option value="">Select Member</option>`;

        if (!data.success) return;

        data.members.forEach(member => {

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


// ===============================
// LOAD PAYMENTS
// ===============================

async function loadPayments() {

    try {

        const res = await fetch(`${API}/all`);

        const data = await res.json();

        if (data.success)
            payments = data.payments;
        else
            payments = [];

        displayPayments(payments);

        updateStats(payments);

    }

    catch (err) {

        console.log(err);

    }

}


// ===============================
// DISPLAY TABLE
// ===============================

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

        <td>${payment.memberName}</td>

        <td>₹${payment.amount}</td>

        <td>

        ${new Date(payment.paymentDate).toLocaleDateString("en-IN")}

        </td>

        <td>

        <span class="${badge}">

        ${payment.method}

        </span>

        </td>

        <td>

        <button
        class="btn btn-sm btn-primary"
        onclick="editPayment('${payment._id}')">

        Edit

        </button>

        <button
        class="btn btn-sm btn-danger"
        onclick="deletePayment('${payment._id}')">

        Delete

        </button>

        </td>

        </tr>

        `;

    });

}


// ===============================
// STATS
// ===============================

function updateStats(data) {

    let total = 0;
    let today = 0;
    let upi = 0;

    const todayDate =
        new Date().toISOString().split("T")[0];

    data.forEach(payment => {

        total += Number(payment.amount);

        if (payment.method === "UPI")
            upi++;

        const date =
            new Date(payment.paymentDate)
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


// ===============================
// SAVE PAYMENT
// ===============================

paymentForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const payment = {

        memberName: memberSelect.value,

        amount: document.getElementById("amount").value,

        paymentDate:
        document.getElementById("paymentDate").value,

        method:
        document.getElementById("paymentMethod").value,

        status: "Completed"

    };

    let url = `${API}/add`;
    let method = "POST";

    if (editId) {

        url = `${API}/update/${editId}`;
        method = "PUT";

    }

    try {

        const res = await fetch(url, {

            method,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payment)

        });

        const data = await res.json();

        alert(data.message);

        if (data.success) {

            bootstrap.Modal
            .getInstance(
                document.getElementById("paymentModal")
            )
            .hide();

            paymentForm.reset();

            editId = null;

            loadPayments();

        }

    }

    catch (err) {

        console.log(err);

    }

});


// ===============================
// EDIT PAYMENT
// ===============================

async function editPayment(id) {

    const res = await fetch(`${API}/${id}`);

    const payment = await res.json();

    editId = id;

    memberSelect.value = payment.memberName;

    document.getElementById("amount").value =
    payment.amount;

    document.getElementById("paymentDate").value =
    new Date(payment.paymentDate)
    .toISOString()
    .split("T")[0];

    document.getElementById("paymentMethod").value =
    payment.method;

    new bootstrap.Modal(
        document.getElementById("paymentModal")
    ).show();

}


// ===============================
// DELETE
// ===============================

async function deletePayment(id) {

    if (!confirm("Delete Payment?"))
        return;

    await fetch(`${API}/delete/${id}`, {

        method: "DELETE"

    });

    loadPayments();

}