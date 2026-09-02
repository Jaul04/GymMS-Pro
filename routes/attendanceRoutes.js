const express = require("express");
const router = express.Router();
const path = require("path");

const attendanceController = require("../controllers/attendanceController");

console.log("✅ Attendance Routes Loaded");

// ======================================
// Attendance Page
// URL: /attendance
// ======================================

router.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "..",
            "public",
            "views",
            "attendance.html"
        )
    );
});

// ======================================
// Get All Attendance
// URL: /attendance/all
// ======================================

router.get(
    "/all",
    attendanceController.getAllAttendance
);

// ======================================
// Add Attendance
// URL: /attendance/add
// ======================================

router.post(
    "/add",
    attendanceController.addAttendance
);

// ======================================
// Attendance Dashboard Stats
// URL: /attendance/stats/dashboard
// ======================================

router.get(
    "/stats/dashboard",
    attendanceController.attendanceStats
);

// ======================================
// QR SCAN ATTENDANCE
// URL: /attendance/scan
// ======================================

router.post(
    "/scan",
    attendanceController.scanAttendance
);

// ======================================
// Get Single Attendance
// URL: /attendance/:id
// ======================================

router.get(
    "/:id",
    attendanceController.getAttendanceById
);

// ======================================
// Update Attendance
// URL: /attendance/update/:id
// ======================================

router.put(
    "/update/:id",
    attendanceController.updateAttendance
);

// ======================================
// Delete Attendance
// URL: /attendance/delete/:id
// ======================================

router.delete(
    "/delete/:id",
    attendanceController.deleteAttendance
);

module.exports = router;