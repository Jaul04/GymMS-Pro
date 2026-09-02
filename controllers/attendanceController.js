const Attendance = require("../models/Attendance");
const Member = require("../models/Member");


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



const scanAttendance = async (req, res) => {

    try {

        const rawMemberId = String(req.body.memberId || "").trim();

        if (!rawMemberId) {
            return res.status(400).json({
                success: false,
                message: "Member ID is required"
            });
        }

        const member = await Member.findOne({
            memberId: rawMemberId
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        if (member.status !== "Active") {
            return res.status(403).json({
                success: false,
                message: `Membership is ${member.status}. Attendance cannot be marked.`
            });
        }

        // Find today's attendance using India time (IST).
        const now = new Date();
        const istParts = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(now);

        const year = Number(istParts.find(p => p.type === "year").value);
        const month = Number(istParts.find(p => p.type === "month").value);
        const day = Number(istParts.find(p => p.type === "day").value);

        const dayStart = new Date(Date.UTC(year, month - 1, day) - (5.5 * 60 * 60 * 1000));
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const alreadyMarked = await Attendance.findOne({
            memberId: member._id,
            attendanceDate: { $gte: dayStart, $lt: dayEnd }
        });

        if (alreadyMarked) {
            return res.status(409).json({
                success: false,
                message: `${member.name} is already marked present today`,
                attendance: alreadyMarked,
                member
            });
        }

        const checkIn = new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(now);

        const attendanceId = `ATT${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

        const attendance = await Attendance.create({
            attendanceId,
            memberId: member._id,
            memberName: member.name,
            attendanceDate: now,
            checkIn,
            checkOut: "-",
            status: "Present"
        });

        res.status(201).json({
            success: true,
            message: `Welcome ${member.name}! Attendance marked successfully.`,
            attendance,
            member
        });

    } catch (err) {

        console.log("QR Attendance Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }

};

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
    scanAttendance,

    getAllAttendance,

    getAttendanceById,

    updateAttendance,

    deleteAttendance,

    attendanceStats

};