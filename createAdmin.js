require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");


mongoose.connect(process.env.MONGO_URI)
.then(async()=>{


    const hashPassword = await bcrypt.hash(
        "123456",
        10
    );


    const admin = new Admin({

        name:"Gym Admin",

        email:"admin@gmail.com",

        password:hashPassword

    });



    await admin.save();


    console.log("Admin Created Successfully");


    process.exit();


})
.catch(err=>{

    console.log(err);

});