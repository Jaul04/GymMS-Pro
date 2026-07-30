const Trainer = require("../models/Trainer");


// Add Trainer
exports.addTrainer = async (req,res)=>{

    try{

        const trainer = new Trainer(req.body);

        await trainer.save();


        res.json({

            success:true,
            message:"Trainer Added Successfully",
            trainer

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};




// Get All Trainers

exports.getTrainers = async(req,res)=>{

    try{

        const trainers = await Trainer.find();


        res.json({

            success:true,
            trainers

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};




// Get Single Trainer

exports.getTrainerById = async(req,res)=>{

    try{

        const trainer = await Trainer.findById(req.params.id);


        res.json({

            success:true,
            trainer

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};





// Update Trainer

exports.updateTrainer = async(req,res)=>{

    try{

        const trainer = await Trainer.findByIdAndUpdate(

            req.params.id,

            req.body,

            {new:true}

        );


        res.json({

            success:true,
            message:"Trainer Updated",
            trainer

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};






// Delete Trainer

exports.deleteTrainer = async(req,res)=>{

    try{

        await Trainer.findByIdAndDelete(req.params.id);


        res.json({

            success:true,
            message:"Trainer Deleted"

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};