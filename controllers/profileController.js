const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");

const uploadDir = path.join(__dirname, "..", "public", "uploads", "profiles");
fs.mkdirSync(uploadDir, { recursive: true });

function saveProfilePhoto(dataUrl, prefix = "profile") {
    if (!dataUrl || typeof dataUrl !== "string") return "";
    const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/);
    if (!match) throw new Error("Invalid profile image. Use JPG, PNG or WEBP.");
    const ext = match[1] === "jpeg" ? "jpg" : match[1];
    const fileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
    fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(match[2], "base64"));
    return `/uploads/profiles/${fileName}`;
}

function cleanBody(body) {
    const data = { ...body };
    delete data.password;
    delete data._id;
    delete data.__v;
    if (data.profilePhoto && data.profilePhoto.startsWith("data:image/")) {
        data.profilePhoto = saveProfilePhoto(data.profilePhoto, "profile");
    }
    return data;
}

exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId).select("-password");
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
        const [members, trainers, payments] = await Promise.all([
            Member.countDocuments(),
            Trainer.countDocuments(),
            Member.countDocuments({ paymentStatus: "Paid" })
        ]);
        res.json({ success: true, admin, stats: { members, trainers, paidMembers: payments } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
        const data = cleanBody(req.body);
        ["name", "username", "email", "phone", "dob", "gender", "address", "bio", "profilePhoto"].forEach(key => {
            if (data[key] !== undefined) admin[key] = data[key];
        });
        if (req.body.password) admin.password = await bcrypt.hash(req.body.password, 10);
        await admin.save();
        res.json({ success: true, message: "Admin profile updated successfully", admin: await Admin.findById(admin._id).select("-password") });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMemberProfile = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });
        res.json({ success: true, member });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTrainerProfile = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });
        const assignedMembers = await Member.find({ trainerId: trainer._id }).select("name memberId email phone status profilePhoto");
        res.json({ success: true, trainer, assignedMembers });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
