const express = require("express");

const router = express.Router();


const path = require("path");


const attendanceController =
require("../controllers/attendanceController");



console.log("✅ Attendance Routes Loaded");


router.get("/",(req,res)=>{


    res.sendFile(

        path.join(

            __dirname,

            "..",

            "views",

            "attendance.html"

        )

    );


});


router.post(
    "/add",
    attendanceController.addAttendance
);





router.get(
    "/all",
    attendanceController.getAllAttendance
);





router.get(
    "/:id",
    attendanceController.getAttendanceById
);





router.put(
    "/update/:id",
    attendanceController.updateAttendance
);






router.delete(
    "/delete/:id",
    attendanceController.deleteAttendance
);





module.exports = router;