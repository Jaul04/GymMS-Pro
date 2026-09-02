document.addEventListener("DOMContentLoaded", () => {
    const rawPaymentData = localStorage.getItem("paymentData");

    if (!rawPaymentData) {
        alert("Payment data not found.");
        window.location.replace("/register");
        return;
    }

    let paymentData;

    try {
        paymentData = JSON.parse(rawPaymentData);
    } catch (error) {
        console.error("PAYMENT DATA ERROR:", error);
        alert("Invalid payment data.");
        window.location.replace("/register");
        return;
    }

    const member = paymentData.member || {};
    const amount = Number(
        paymentData.amount ?? member.amount ?? 0
    );

    setText("memberName", member.name || "-");
    setText("memberId", member._id ? String(member._id).slice(-8).toUpperCase() : "-");
    setText("memberEmail", member.email || "-");
    setText("memberPhone", member.phone || "-");
    setText("memberPlan", paymentData.plan || member.plan || "-");

    const formattedAmount = "₹" + amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    setText("memberAmount", formattedAmount);
    setText("totalAmount", formattedAmount);
    setText("paymentId", paymentData.paymentId || "-");
    setText("paymentMethod", paymentData.paymentMethod || "Razorpay");
    setText("paymentStatus", (paymentData.paymentStatus || "Paid").toUpperCase());
    setText("transactionId", paymentData.razorpayPaymentId || "-");

    const paymentDate = paymentData.paymentDate || new Date().toISOString();
    setText("paymentDate", formatDate(paymentDate));
    setText("paymentTime", formatTime(paymentDate));
    setText("joinDate", formatDate(member.joinDate));
    setText("expiryDate", formatDate(member.expiryDate));

    const params = new URLSearchParams(window.location.search);

    if (params.get("autoprint") === "1") {
        setTimeout(() => window.print(), 700);
    }
});

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).toUpperCase();
}

function formatTime(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

function downloadReceipt() {
    const paymentData = JSON.parse(
        localStorage.getItem("paymentData") || "{}"
    );

    if (!paymentData.receiptUrl) {
        alert("Receipt link is not available. Please contact the gym.");
        return;
    }

    window.open(paymentData.receiptUrl, "_blank");
}

function newRegistration() {
    localStorage.removeItem("paymentData");
    localStorage.removeItem("gymMember");
    window.location.href = "/register";
}
