const Trainer = require("../models/Trainer");

exports.addTrainer = async (req, res) => {
    try {
        const trainer = new Trainer({
            trainerId: req.body.trainerId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender || "",
            dob: req.body.dob || null,
            address: req.body.address || "",
            profilePhoto: req.body.profilePhoto || "",
            bio: req.body.bio || "",
            specialization: req.body.specialization,
            experience: Number(req.body.experience || 0),
            salary: Number(req.body.salary || 0),
            status: req.body.status || "Active"
        });
        await trainer.save();
        res.json({ success: true, message: "Trainer Added Successfully", trainer });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find().sort({ createdAt: -1 });
        res.json({ success: true, trainers });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });
        res.json({ success: true, trainer });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateTrainer = async (req, res) => {
    try {
        const allowed = ["trainerId","name","email","phone","gender","dob","address","profilePhoto","bio","specialization","experience","salary","status"];
        const data = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k]; });
        if (data.experience !== undefined) data.experience = Number(data.experience);
        if (data.salary !== undefined) data.salary = Number(data.salary);
        const trainer = await Trainer.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });
        res.json({ success: true, message: "Trainer Updated", trainer });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteTrainer = async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Trainer Deleted" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
