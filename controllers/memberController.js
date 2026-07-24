const Member = require("../models/Member");
console.log(require("../models/Member"));
console.log(require.cache[require.resolve("../models/Member")]);

const addMember = async (req, res) => {

    try {

        const count = await Member.countDocuments();

        const member = new Member({

            memberId: "MEM" + String(count + 1).padStart(3, "0"),

            name: req.body.name,

            email: req.body.email,

            phone: req.body.phone,

            plan: req.body.plan,

            joinDate: req.body.joinDate,

            expiryDate: req.body.expiryDate

        });


        await member.save();


        res.status(201).json({

            success: true,

            message: "Member Added Successfully",

            member

        });


    } catch (err) {

        console.log(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};



const getAllMembers = async (req,res)=>{

    try{

        const members = await Member.find().sort({createdAt:-1});

        res.json(members);


    }catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};


const updateMember = async (req, res) => {
    try {

        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "Member Updated Successfully",
            member: updatedMember
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


const deleteMember = async(req,res)=>{

    try{

        await Member.findByIdAndDelete(req.params.id);

        res.json({
            success:true,
            message:"Member Deleted Successfully"
        });

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

const getMemberById = async(req,res)=>{

    try{

        const member = await Member.findById(req.params.id);

        if(!member){

            return res.status(404).json({
                message:"Member not found"
            });

        }

        res.json(member);

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

const memberStats = async (req, res) => {

    try {

        const total = await Member.countDocuments();

        const active = await Member.countDocuments({
            status: "Active"
        });

        const expired = await Member.countDocuments({
            status: "Expired"
        });

        const monthly = await Member.countDocuments({
            plan: "Monthly"
        });

        res.json({
            total,
            active,
            expired,
            monthly
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = {

    addMember,
    getAllMembers,
    updateMember,
    deleteMember,
    getMemberById,
    memberStats

};