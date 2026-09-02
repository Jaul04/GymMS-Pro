const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Payment = require("../models/Payment");

const COLORS = {
    black: "#090909",
    panel: "#121212",
    panel2: "#171717",
    yellow: "#f4b400",
    white: "#ffffff",
    muted: "#b8b8b8",
    line: "#303030",
    green: "#22c55e",
    red: "#ef4444"
};

function safe(value, fallback = "-") {
    if (value === undefined || value === null || String(value).trim() === "") {
        return fallback;
    }
    return String(value);
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

function formatAmount(value) {
    const amount = Number(value || 0);
    return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function drawDumbbell(doc, x, y, scale = 1) {
    const s = scale;

    doc.save();
    doc.strokeColor(COLORS.yellow);
    doc.fillColor(COLORS.yellow);
    doc.lineWidth(3 * s);

    doc.roundedRect(x, y + 8 * s, 8 * s, 24 * s, 2 * s).fill();
    doc.roundedRect(x + 42 * s, y + 8 * s, 8 * s, 24 * s, 2 * s).fill();
    doc.roundedRect(x + 7 * s, y + 13 * s, 8 * s, 14 * s, 2 * s).fill();
    doc.roundedRect(x + 35 * s, y + 13 * s, 8 * s, 14 * s, 2 * s).fill();
    doc.rect(x + 15 * s, y + 18 * s, 20 * s, 4 * s).fill();

    doc.restore();
}

function drawLabelValue(doc, label, value, x, y, width, options = {}) {
    const valueColor = options.valueColor || COLORS.white;
    const valueSize = options.valueSize || 10;

    doc.font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(COLORS.muted)
        .text(label.toUpperCase(), x, y, { width });

    doc.font("Helvetica-Bold")
        .fontSize(valueSize)
        .fillColor(valueColor)
        .text(safe(value), x, y + 11, { width });
}

function drawSectionTitle(doc, title, x, y, width) {
    doc.font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(COLORS.yellow)
        .text(title.toUpperCase(), x, y, { width });

    doc.strokeColor(COLORS.line)
        .lineWidth(0.8)
        .moveTo(x, y + 14)
        .lineTo(x + width, y + 14)
        .stroke();
}

// =====================================
// CREATE PREMIUM GYM PRO RECEIPT PDF
// =====================================

async function createReceiptPdf(payment) {
    if (!payment) {
        throw new Error("Payment data is required");
    }

    const receiptsDir = path.join(__dirname, "../receipts");
    await fs.promises.mkdir(receiptsDir, { recursive: true });

    const fileName = `receipt-${payment._id}.pdf`;
    const filePath = path.join(receiptsDir, fileName);

    return new Promise((resolve, reject) => {
        // A4 portrait receipt with the dark Gym Pro visual style.
        const doc = new PDFDocument({
            size: "A4",
            margin: 0,
            info: {
                Title: `Gym Pro Payment Receipt - ${safe(payment.paymentId)}`,
                Author: "Gym Pro"
            }
        });

        const stream = fs.createWriteStream(filePath);

        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
        doc.on("error", reject);
        doc.pipe(stream);

        const pageW = doc.page.width;
        const pageH = doc.page.height;
        const margin = 34;
        const contentW = pageW - margin * 2;

        // -------------------------------------
        // BACKGROUND
        // -------------------------------------
        doc.rect(0, 0, pageW, pageH).fill(COLORS.black);

        // -------------------------------------
        // TOP BRAND AREA
        // -------------------------------------
        doc.rect(0, 0, pageW, 9).fill(COLORS.yellow);

        drawDumbbell(doc, margin, 28, 0.72);

        doc.font("Helvetica-Bold")
            .fontSize(20)
            .fillColor(COLORS.white)
            .text("GYM PRO", margin + 43, 31);

        doc.font("Helvetica")
            .fontSize(8)
            .fillColor(COLORS.muted)
            .text("FITNESS & MEMBERSHIP", margin + 44, 54);

        // Receipt title on right.
        doc.font("Helvetica-Bold")
            .fontSize(19)
            .fillColor(COLORS.white)
            .text("PAYMENT RECEIPT", margin, 31, {
                width: contentW,
                align: "right"
            });

        doc.font("Helvetica")
            .fontSize(8)
            .fillColor(COLORS.yellow)
            .text("OFFICIAL PAYMENT DOCUMENT", margin, 55, {
                width: contentW,
                align: "right"
            });

        // -------------------------------------
        // BEAST MODE STRIP
        // -------------------------------------
        doc.roundedRect(margin, 82, contentW, 64, 10)
            .fill(COLORS.panel);

        doc.font("Helvetica-Bold")
            .fontSize(24)
            .fillColor(COLORS.white)
            .text("BEAST", margin + 20, 97);

        doc.font("Helvetica-Bold")
            .fontSize(24)
            .fillColor(COLORS.yellow)
            .text("MODE", margin + 92, 97);

        doc.font("Helvetica")
            .fontSize(8)
            .fillColor(COLORS.muted)
            .text("PAYMENT RECEIVED • MEMBERSHIP ACTIVATED", margin + 20, 126);

        // Success badge.
        doc.roundedRect(pageW - margin - 122, 99, 102, 28, 14)
            .fill(COLORS.green);

        doc.font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(COLORS.white)
            .text("✓  PAYMENT SUCCESSFUL", pageW - margin - 114, 108, {
                width: 90,
                align: "center"
            });

        // -------------------------------------
        // RECEIPT META
        // -------------------------------------
        let y = 166;
        const gap = 14;
        const colW = (contentW - gap) / 2;

        doc.roundedRect(margin, y, colW, 58, 8).fill(COLORS.panel2);
        doc.roundedRect(margin + colW + gap, y, colW, 58, 8).fill(COLORS.panel2);

        drawLabelValue(doc, "Receipt Number", payment.paymentId, margin + 14, y + 11, colW - 28);
        drawLabelValue(doc, "Payment Date", formatDate(payment.paymentDate), margin + 14, y + 33, colW - 28);

        drawLabelValue(doc, "Payment Time", formatTime(payment.paymentDate), margin + colW + gap + 14, y + 11, colW - 28);
        drawLabelValue(doc, "Payment Status", safe(payment.paymentStatus, "PAID").toUpperCase(), margin + colW + gap + 14, y + 33, colW - 28, {
            valueColor: COLORS.green
        });

        // -------------------------------------
        // MEMBER DETAILS
        // -------------------------------------
        y += 78;
        drawSectionTitle(doc, "Member Details", margin, y, contentW);

        y += 26;
        doc.roundedRect(margin, y, contentW, 82, 8).fill(COLORS.panel2);

        const memberGap = 16;
        const memberCol = (contentW - memberGap * 2) / 3;

        drawLabelValue(doc, "Member Name", payment.memberName, margin + 15, y + 14, memberCol);
        drawLabelValue(doc, "Member ID", payment.memberId ? String(payment.memberId).slice(-8).toUpperCase() : "-", margin + memberCol + memberGap + 15, y + 14, memberCol);
        drawLabelValue(doc, "Phone", payment.memberPhone, margin + (memberCol + memberGap) * 2 + 15, y + 14, memberCol);

        drawLabelValue(doc, "Email", payment.memberEmail, margin + 15, y + 48, memberCol * 2 + memberGap);
        drawLabelValue(doc, "Membership Plan", payment.plan, margin + (memberCol + memberGap) * 2 + 15, y + 48, memberCol);

        // -------------------------------------
        // MEMBERSHIP / PAYMENT DETAILS
        // -------------------------------------
        y += 102;
        drawSectionTitle(doc, "Payment Details", margin, y, contentW);

        y += 26;
        const detailH = 148;
        doc.roundedRect(margin, y, contentW, detailH, 8).fill(COLORS.panel2);

        const leftX = margin + 16;
        const rightX = margin + contentW / 2 + 5;
        const detailW = contentW / 2 - 27;

        drawLabelValue(doc, "Membership Plan", payment.plan, leftX, y + 15, detailW, { valueSize: 11 });
        drawLabelValue(doc, "Amount Paid", formatAmount(payment.amount), rightX, y + 15, detailW, {
            valueColor: COLORS.yellow,
            valueSize: 15
        });

        drawLabelValue(doc, "Payment Method", payment.paymentMode || "Razorpay", leftX, y + 52, detailW);
        drawLabelValue(doc, "Source", payment.source || "Online", rightX, y + 52, detailW);

        drawLabelValue(doc, "Transaction ID", payment.razorpayPaymentId || payment.transactionId, leftX, y + 89, detailW);
        drawLabelValue(doc, "Order ID", payment.razorpayOrderId, rightX, y + 89, detailW);

        // Total strip.
        doc.roundedRect(margin + 14, y + 121, contentW - 28, 1, 0).fill(COLORS.line);
        doc.font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(COLORS.muted)
            .text("TOTAL AMOUNT PAID", leftX, y + 130);

        doc.font("Helvetica-Bold")
            .fontSize(17)
            .fillColor(COLORS.yellow)
            .text(formatAmount(payment.amount), rightX, y + 126, {
                width: detailW,
                align: "right"
            });

        // -------------------------------------
        // MEMBERSHIP VALIDITY
        // -------------------------------------
        y += detailH + 22;
        drawSectionTitle(doc, "Membership Validity", margin, y, contentW);

        y += 26;
        doc.roundedRect(margin, y, contentW, 62, 8).fill(COLORS.panel2);

        drawLabelValue(doc, "Valid From", payment.joinDate, margin + 16, y + 13, colW - 20);
        drawLabelValue(doc, "Valid Until", payment.expiryDate, margin + colW + gap + 16, y + 13, colW - 20);

        // -------------------------------------
        // FOOTER
        // -------------------------------------
        const footerY = pageH - 91;

        doc.roundedRect(margin, footerY, contentW, 56, 8).fill(COLORS.panel);

        doc.font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(COLORS.yellow)
            .text("THANK YOU FOR CHOOSING GYM PRO", margin + 15, footerY + 12, {
                width: contentW - 30,
                align: "center"
            });

        doc.font("Helvetica")
            .fontSize(7)
            .fillColor(COLORS.muted)
            .text("Train Hard • Stay Strong • Stay Consistent", margin + 15, footerY + 28, {
                width: contentW - 30,
                align: "center"
            });

        doc.font("Helvetica")
            .fontSize(6.5)
            .fillColor("#777777")
            .text("This receipt is system generated and does not require a signature.", margin, footerY + 69, {
                width: contentW,
                align: "center"
            });

        doc.end();
    });
}

// =====================================
// DOWNLOAD RECEIPT PDF
// GET /payment/receipt/:id
// GET /payments/receipt/:id
// =====================================

exports.downloadReceipt = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        const receiptsDir = path.join(__dirname, "../receipts");
        const fileName = `receipt-${payment._id}.pdf`;
        const filePath = path.join(receiptsDir, fileName);

        if (!fs.existsSync(filePath)) {
            await createReceiptPdf(payment);
        }

        return res.download(filePath, fileName);
    } catch (error) {
        console.log("DOWNLOAD RECEIPT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Backward compatibility for any older route/import.
exports.generateReceipt = exports.downloadReceipt;
exports.createReceiptPdf = createReceiptPdf;
