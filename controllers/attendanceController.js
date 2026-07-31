const Attendance = require("../models/Attendance");

// ============================
// ADD ATTENDANCE
// ============================

const addAttendance = async (req, res) => {

    try {

        const last = await Attendance.findOne().sort({ createdAt: -1 });

        let attendanceId = "ATT001";

        if (last && last.attendanceId) {

            const number = parseInt(
                last.attendanceId.replace("ATT", "")
            );

            attendanceId =
                "ATT" +
                String(number + 1).padStart(3, "0");

        }

        const attendance = new Attendance({

            attendanceId,

            memberId: req.body.memberId,

            memberName: req.body.memberName,

            attendanceDate: req.body.attendanceDate,

            checkIn: req.body.checkIn,

            checkOut: req.body.checkOut,

            status: req.body.status

        });

        await attendance.save();

        res.status(201).json({

            success: true,

            message: "Attendance Added Successfully",

            attendance

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// GET ALL ATTENDANCE
// ============================

const getAllAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.find()

            .sort({ attendanceDate: -1 });

        res.json({

            success: true,

            attendance

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// GET SINGLE ATTENDANCE
// ============================

const getAttendanceById = async (req, res) => {

    try {

        const attendance =
            await Attendance.findById(req.params.id);

        if (!attendance) {

            return res.status(404).json({

                success: false,

                message: "Attendance Not Found"

            });

        }

        res.json({

            success: true,

            attendance

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// UPDATE ATTENDANCE
// ============================

const updateAttendance = async (req, res) => {

    try {

        const attendance =
            await Attendance.findByIdAndUpdate(

                req.params.id,

                req.body,

                {

                    new: true

                }

            );

        res.json({

            success: true,

            message: "Attendance Updated Successfully",

            attendance

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// DELETE ATTENDANCE
// ============================

const deleteAttendance = async (req, res) => {

    try {

        await Attendance.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Attendance Deleted Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// DASHBOARD STATS
// ============================

const attendanceStats = async (req, res) => {

    try {

        const total =
            await Attendance.countDocuments();

        const present =
            await Attendance.countDocuments({

                status: "Present"

            });

        const absent =
            await Attendance.countDocuments({

                status: "Absent"

            });

        res.json({

            success: true,

            total,

            present,

            absent

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    addAttendance,

    getAllAttendance,

    getAttendanceById,

    updateAttendance,

    deleteAttendance,

    attendanceStats

};