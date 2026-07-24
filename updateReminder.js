require("dotenv").config();

const mongoose = require("mongoose");
const Member = require("./models/Member");


mongoose.connect(process.env.MONGO_URI)
.then(async()=>{

    await Member.updateMany(
        {
            reminderSent:{
                $exists:false
            }
        },
        {
            $set:{
                reminderSent:false
            }
        }
    );


    console.log("Reminder field added");


    process.exit();

})
.catch(err=>{

    console.log(err);

});