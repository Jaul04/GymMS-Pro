const Attendance = require("../models/Attendance");


const addAttendance = async(req,res)=>{


    try{


        const count =
        await Attendance.countDocuments();



        const attendance =
        new Attendance({



            attendanceId:

            "ATT" +
            String(count + 1)
            .padStart(3,"0"),





            memberName:

            req.body.memberName,





            attendanceDate:

            req.body.attendanceDate,





            checkIn:

            req.body.checkIn,





            checkOut:

            req.body.checkOut,





            status:

            req.body.status



        });





        await attendance.save();





        res.status(201).json({


            success:true,


            message:
            "Attendance Added Successfully",


            attendance


        });





    }

    catch(error){


        console.log(
            "Add Attendance Error:",
            error
        );



        res.status(500).json({


            success:false,


            message:error.message


        });



    }



};





const getAllAttendance = async(req,res)=>{


    try{


        const attendance =

        await Attendance.find()

        .sort({

            createdAt:-1

        });




        res.json(attendance);




    }


    catch(error){



        res.status(500).json({


            success:false,


            message:error.message


        });



    }


};





const getAttendanceById = async(req,res)=>{


    try{


        const attendance =

        await Attendance.findById(
            req.params.id
        );




        if(!attendance){


            return res.status(404).json({


                success:false,


                message:
                "Attendance Not Found"


            });



        }




        res.json(attendance);



    }


    catch(error){



        res.status(500).json({


            success:false,


            message:error.message


        });



    }



};



const updateAttendance = async(req,res)=>{


    try{


        const attendance =

        await Attendance.findByIdAndUpdate(


            req.params.id,


            {


                memberName:
                req.body.memberName,



                attendanceDate:
                req.body.attendanceDate,



                checkIn:
                req.body.checkIn,



                checkOut:
                req.body.checkOut,



                status:
                req.body.status


            },


            {

                new:true

            }


        );





        if(!attendance){


            return res.status(404).json({


                success:false,


                message:
                "Attendance Not Found"


            });



        }





        res.json({


            success:true,


            message:
            "Attendance Updated Successfully",


            attendance


        });





    }


    catch(error){


        res.status(500).json({


            success:false,


            message:error.message


        });



    }



};




const deleteAttendance = async(req,res)=>{


    try{


        const attendance =

        await Attendance.findByIdAndDelete(

            req.params.id

        );





        if(!attendance){


            return res.status(404).json({


                success:false,


                message:
                "Attendance Not Found"


            });



        }






        res.json({


            success:true,


            message:
            "Attendance Deleted Successfully"



        });





    }


    catch(error){


        res.status(500).json({


            success:false,


            message:error.message


        });



    }



};








module.exports = {


    addAttendance,

    getAllAttendance,

    getAttendanceById,

    updateAttendance,

    deleteAttendance


};