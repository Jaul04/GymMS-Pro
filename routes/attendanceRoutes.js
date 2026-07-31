const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceController");



// ============================
// Attendance Page / Get All
// URL: /attendance
// ============================

router.get(
    "/",
    attendanceController.getAllAttendance
);



// ============================
// Add Attendance
// URL: /attendance/add
// ============================

router.post(
    "/add",
    attendanceController.addAttendance
);



// ============================
// Get All Attendance
// URL: /attendance/all
// ============================

router.get(
    "/all",
    attendanceController.getAllAttendance
);



// ============================
// Attendance Dashboard Stats
// URL: /attendance/stats/dashboard
// ============================

router.get(
    "/stats/dashboard",
    attendanceController.attendanceStats
);



// ============================
// Update Attendance
// URL: /attendance/update/:id
// ============================

router.put(
    "/update/:id",
    attendanceController.updateAttendance
);



// ============================
// Delete Attendance
// URL: /attendance/delete/:id
// ============================

router.delete(
    "/delete/:id",
    attendanceController.deleteAttendance
);



// ============================
// Get Single Attendance
// URL: /attendance/:id
// KEEP LAST
// ============================

router.get(
    "/:id",
    attendanceController.getAttendanceById
);



module.exports = router;