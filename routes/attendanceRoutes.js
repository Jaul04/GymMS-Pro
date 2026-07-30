const express = require("express");

const router = express.Router();

const path = require("path");


const attendanceController =
require("../controllers/attendanceController");


console.log("✅ Attendance Routes Loaded");



// Attendance Page

router.get("/", (req,res)=>{


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




// Add Attendance

router.post(
    "/add",
    attendanceController.addAttendance
);




// Get All Attendance

router.get(
    "/all",
    attendanceController.getAllAttendance
);




// Get Attendance By ID

router.get(
    "/:id",
    attendanceController.getAttendanceById
);




// Update Attendance

router.put(
    "/update/:id",
    attendanceController.updateAttendance
);




// Delete Attendance

router.delete(
    "/delete/:id",
    attendanceController.deleteAttendance
);



module.exports = router;