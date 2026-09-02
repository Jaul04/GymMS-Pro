const Plan = require("../models/Plan");





exports.addPlan = async(req,res)=>{


    try{


        const plan =
        new Plan(req.body);


        await plan.save();


        res.json({

            success:true,

            message:"Plan Added Successfully",

            plan

        });


    }

    catch(error){


        console.log(error);


        res.json({

            success:false,

            message:error.message

        });


    }


};








exports.getPlans = async(req,res)=>{


    try{


        const plans =
        await Plan.find();


        res.json({

            success:true,

            plans

        });


    }

    catch(error){


        res.json({

            success:false,

            message:error.message

        });


    }


};