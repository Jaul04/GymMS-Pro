const Member = require("../models/Member");

// =========================
// ADD MEMBER
// =========================

const addMember = async (req, res) => {

    try {

        const lastMember = await Member.findOne().sort({ createdAt: -1 });

        let memberId = "MEM001";

        if (lastMember && lastMember.memberId) {

            const lastNumber = parseInt(
                lastMember.memberId.replace("MEM", "")
            );

            memberId =
                "MEM" +
                String(lastNumber + 1).padStart(3, "0");

        }

        const member = new Member({

            memberId,

            name: req.body.name,

            email: req.body.email,

            phone: req.body.phone,

            gender: req.body.gender,

            dob: req.body.dob,

            address: req.body.address,

            emergencyContact:
            req.body.emergencyContact,

            plan: req.body.plan,

            amount: req.body.amount,

            joinDate: req.body.joinDate,

            expiryDate: req.body.expiryDate,

            registrationType: "Offline",

            paymentStatus: "Paid",

            status: "Active"

        });

        await member.save();

        res.status(201).json({

            success: true,

            message: "Member Added Successfully",

            member

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

// =========================
// GET ALL MEMBERS
// =========================

const getAllMembers = async (req, res) => {

    try {

        const members =
        await Member.find().sort({
            createdAt: -1
        });

        res.json({

            success: true,

            members

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

// =========================
// UPDATE MEMBER
// =========================

const updateMember = async (req, res) => {

    try {

        const member =
        await Member.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );

        res.json({

            success: true,

            message: "Member Updated Successfully",

            member

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =========================
// DELETE MEMBER
// =========================

const deleteMember = async (req, res) => {

    try {

        await Member.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success: true,

            message: "Member Deleted Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =========================
// GET MEMBER BY ID
// =========================

const getMemberById = async (req, res) => {

    try {

        const member =
        await Member.findById(
            req.params.id
        );

        if (!member) {

            return res.status(404).json({

                success: false,

                message: "Member Not Found"

            });

        }

        res.json({

            success: true,

            member

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =========================
// ONLINE REGISTRATION
// =========================

const registerMember = async (req, res) => {

    try {

        const existingMember =
        await Member.findOne({

            email: req.body.email

        });

        if (existingMember) {

            return res.status(400).json({

                success: false,

                message: "Email already registered."

            });

        }

        const lastMember =
        await Member.findOne().sort({

            createdAt: -1

        });

        let memberId = "MEM001";

        if (lastMember && lastMember.memberId) {

            const lastNumber =
            parseInt(
                lastMember.memberId.replace("MEM", "")
            );

            memberId =
            "MEM" +
            String(lastNumber + 1).padStart(3, "0");

        }

        const joinDate =
        req.body.joinDate
        ? new Date(req.body.joinDate)
        : new Date();

        let expiryDate =
        req.body.expiryDate
        ? new Date(req.body.expiryDate)
        : new Date(joinDate);

        if (!req.body.expiryDate) {

            switch (req.body.plan) {

                case "Monthly":
                    expiryDate.setDate(expiryDate.getDate() + 30);
                    break;

                case "Quarterly":
                    expiryDate.setDate(expiryDate.getDate() + 90);
                    break;

                case "Half-Yearly":
                    expiryDate.setDate(expiryDate.getDate() + 180);
                    break;

                case "Yearly":
                    expiryDate.setDate(expiryDate.getDate() + 365);
                    break;

            }

        }

        const member = new Member({

            memberId,

            name: req.body.name,

            email: req.body.email,

            phone: req.body.phone,

            gender: req.body.gender,

            dob: req.body.dob,

            address: req.body.address,

            emergencyContact:
            req.body.emergencyContact,

            plan: req.body.plan,

            amount: req.body.amount,

            joinDate,

            expiryDate,

            registrationType: "Online",

            paymentStatus: "Pending",

            status: "Pending"

        });

        await member.save();

        res.status(201).json({

            success: true,

            message: "Registration Successful",

            member

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
// =========================
// DASHBOARD STATS
// =========================

const memberStats = async (req, res) => {

    try {

        const total =
        await Member.countDocuments();

        const active =
        await Member.countDocuments({

            status: "Active"

        });

        const pending =
        await Member.countDocuments({

            status: "Pending"

        });

        const expired =
        await Member.countDocuments({

            status: "Expired"

        });

        const monthly =
        await Member.countDocuments({

            plan: "Monthly"

        });

        const quarterly =
        await Member.countDocuments({

            plan: "Quarterly"

        });

        const halfYearly =
        await Member.countDocuments({

            plan: "Half-Yearly"

        });

        const yearly =
        await Member.countDocuments({

            plan: "Yearly"

        });

        res.json({

            success: true,

            total,

            active,

            pending,

            expired,

            monthly,

            quarterly,

            halfYearly,

            yearly

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

// =========================
// EXPORTS
// =========================

module.exports = {

    addMember,

    getAllMembers,

    updateMember,

    deleteMember,

    getMemberById,

    registerMember,

    memberStats

};