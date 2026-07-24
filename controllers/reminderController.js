const Member = require("../models/Member");

const sendExpiryReminder =
require("../services/emailService");


const sendExpiryReminders = async(req,res)=>{


try{


const today = new Date();


today.setHours(
    0,
    0,
    0,
    0
);


const reminderDate =
new Date(today);


reminderDate.setDate(
    today.getDate()+7
);



reminderDate.setHours(
    23,
    59,
    59,
    999
);





const members =
await Member.find({

    expiryDate:{

        $gte:today,

        $lte:reminderDate

    },

    status:"Active",

    reminderSent:false

});







let sent = 0;




for(const member of members){


    try{


        await sendExpiryReminder(member);


        member.reminderSent = true;


        await member.save();



        sent++;



    }


    catch(error){


        console.log(
            "Email Error for:",
            member.email,
            error.message
        );


    }


}







res.json({

success:true,

message:"Expiry reminders sent",

totalMembers:members.length,

emailsSent:sent


});






}

catch(error){


console.log(error);



res.status(500).json({

success:false,

message:error.message

});


}



};







module.exports = {

sendExpiryReminders

};