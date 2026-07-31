const mongoose = require("mongoose");


const attendanceSchema = new mongoose.Schema({

    attendanceId:{

        type:String,

        unique:true,

        required:true

    },


    memberId:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Member",

        required:true

    },


    memberName:{

        type:String,

        required:true

    },


    attendanceDate:{

        type:Date,

        required:true,

        default:Date.now

    },


    checkIn:{

        type:String,

        default:"-"

    },


    checkOut:{

        type:String,

        default:"-"

    },


    status:{

        type:String,

        enum:[

            "Present",

            "Absent"

        ],

        default:"Present"

    }


},{

    timestamps:true

});



module.exports =
mongoose.model(
    "Attendance",
    attendanceSchema
);