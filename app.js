require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcryptjs");

const authMiddleware = require("./middleware/auth");

const Admin = require("./models/Admin");

const memberRoutes = require("./routes/memberRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.log("❌ MongoDB Error:", err);
    });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        req.session.admin = true;
        req.session.adminId = admin._id;

        return res.json({
            success: true,
            message: "Login Successful",
        });
    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: "Server Error",
        });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect("/dashboard");
        }

        res.redirect("/login");
    });
});

app.use("/dashboard", authMiddleware);

app.use("/members", authMiddleware, memberRoutes);

app.use("/payments", authMiddleware, paymentRoutes);

app.use("/attendance", authMiddleware, attendanceRoutes);

app.use("/dashboard", authMiddleware, dashboardRoutes);

app.use("/", reminderRoutes);

app.get("/admin-profile", authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId).select("-password");

        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found",
            });
        }

        res.json({
            success: true,
            admin,
        });
    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Server Error",
        });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});