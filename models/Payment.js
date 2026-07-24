const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({

    paymentId:{

        type:String,
        unique:true

    },


    memberId:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"

    },


    memberName:{

        type:String,
        required:true

    },


    amount:{

        type:Number,
        required:true

    },


    paymentDate:{

        type:Date,
        required:true

    },


    method:{

        type:String,

        enum:[
            "Cash",
            "UPI",
            "Card"
        ],

        default:"Cash"

    },


    status:{

        type:String,

        enum:[
            "Completed",
            "Pending"
        ],

        default:"Completed"

    }


},{

    timestamps:true

});




module.exports =
mongoose.model(
    "Payment",
    paymentSchema
);