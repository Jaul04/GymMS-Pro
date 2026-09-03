require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcryptjs");

// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware = require("./middleware/auth");

// ==========================================
// MODEL
// ==========================================

const Admin = require("./models/Admin");

// ==========================================
// ROUTES
// ==========================================

const memberRoutes = require("./routes/memberRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentGatewayRoutes = require("./routes/paymentGatewayRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const planRoutes = require("./routes/planRoutes");
const profileRoutes = require("./routes/profileRoutes");

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// BODY PARSER
// ==========================================

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json({ limit: "8mb" }));

// ==========================================
// STATIC FOLDER
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// ==========================================
// SESSION
// ==========================================

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

// ==========================================
// MONGODB
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.log(
            "❌ MongoDB Error:",
            err
        );
    });

// ==========================================================
// PAGE ROUTES
// ==========================================================

// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "home.html"
        )
    );

});

// ==========================================
// PAYMENTS MANAGEMENT PAGE
// ==========================================
// IMPORTANT:
// Actual file name is payment-management.html
// NOT payments.html

app.get(
    "/payment-management",
    authMiddleware,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "views",
                "payment-management.html"
            )
        );

    }
);

// ==========================================
// LOGIN PAGE
// ==========================================

app.get("/login", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "login.html"
        )
    );

});

// ==========================================
// REGISTER PAGE
// ==========================================

app.get("/register", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "register.html"
        )
    );

});

// ==========================================
// ONLINE PAYMENT PAGE
// ==========================================

app.get("/online-payment", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "online-payment.html"
        )
    );

});

// ==========================================
// PAYMENT SUCCESS PAGE
// ==========================================

app.get("/payment-success", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "payment-success.html"
        )
    );

});

// ==========================================================
// ADMIN LOGIN
// ==========================================================

app.post("/login", async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {

        const admin =
            await Admin.findOne({
                email
            });

        // --------------------------------------
        // ADMIN NOT FOUND
        // --------------------------------------

        if (!admin) {

            return res.json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        // --------------------------------------
        // PASSWORD CHECK
        // --------------------------------------

        const match =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!match) {

            return res.json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        // --------------------------------------
        // CREATE SESSION
        // --------------------------------------

        req.session.admin = true;

        req.session.adminId =
            admin._id;

        // --------------------------------------
        // LOGIN SUCCESS
        // --------------------------------------

        res.json({
            success: true,
            message: "Login Successful"
        });

    }

    catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Server Error"
        });

    }

});

// ==========================================================
// LOGOUT
// ==========================================================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

// ==========================================================
// API ROUTES
// ==========================================================

// ==========================================
// MEMBERS
// ==========================================

app.use(
    "/members",
    memberRoutes
);

// ==========================================
// PAYMENTS
// ==========================================
// These are PAYMENT APIs.
// Example:
// /payments/all
// /payments/add
// /payments/receipt/:id

app.use(
    "/payments",
    authMiddleware,
    paymentRoutes
);

// ==========================================
// RAZORPAY PAYMENT GATEWAY
// ==========================================
// Example:
// /payment/create-order
// /payment/verify

app.use(
    "/payment",
    paymentGatewayRoutes
);

// ==========================================
// ATTENDANCE
// ==========================================

app.use(
    "/attendance",
    authMiddleware,
    attendanceRoutes
);

// ==========================================
// DASHBOARD
// ==========================================

app.use(
    "/dashboard",
    authMiddleware,
    dashboardRoutes
);

// ==========================================
// TRAINER API
// ==========================================

app.use(
    "/trainers",
    trainerRoutes
);

// ==========================================
// PROFILE SYSTEM
// ==========================================
app.use(
    "/api/profile",
    authMiddleware,
    profileRoutes
);

// ==========================================
// PLAN API
// ==========================================

app.use(
    "/plans",
    planRoutes
);

// ==========================================
// REMINDER
// ==========================================

app.use(
    "/",
    reminderRoutes
);

// ==========================================================
// TRAINER PAGE
// ==========================================================

app.get(
    "/trainer",
    authMiddleware,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "views",
                "trainer.html"
            )
        );

    }
);

// ==========================================================
// PLANS PAGE
// ==========================================================

app.get(
    "/plans-management",
    authMiddleware,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "views",
                "plans.html"
            )
        );

    }
);

// ==========================================================
// ADMIN PROFILE PAGE
// ==========================================================

app.get(
    "/admin-profile",
    authMiddleware,
    (req, res) => {
        res.sendFile(
            path.join(__dirname, "public", "views", "admin-profile.html")
        );
    }
);

// ==========================================================
// SERVER
// ==========================================================

const PORT =
    process.env.PORT || 8000;

// ==========================================================
// START SERVER
// ==========================================================
// 0.0.0.0 allows the website to be accessed
// from other devices on the same network.

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🚀 Server Running on Port ${PORT}`
        );

        console.log(
            `📱 Mobile Access: http://10.84.208.77:${PORT}`
        );

    }
);