require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcryptjs");


// Middleware

const authMiddleware = require("./middleware/auth");


// Model

const Admin = require("./models/Admin");


// Routes

const memberRoutes = require("./routes/memberRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentGatewayRoutes = require("./routes/paymentGatewayRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const planRoutes = require("./routes/planRoutes");



const app = express();




// Body Parser

app.use(
    bodyParser.urlencoded({
        extended:true
    })
);


app.use(bodyParser.json());




// Static Folder

app.use(
    express.static(
        path.join(__dirname,"public")
    )
);





// Session

app.use(
    session({

        secret:process.env.SESSION_SECRET,

        resave:false,

        saveUninitialized:false

    })
);







// MongoDB

mongoose
.connect(process.env.MONGO_URI)

.then(()=>{

    console.log("✅ MongoDB Connected");

})

.catch((err)=>{

    console.log(
        "❌ MongoDB Error:",
        err
    );

});









// =========================
// PAGE ROUTES
// =========================


app.get("/",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "home.html"
        )
    );

});






app.get("/login",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "login.html"
        )
    );

});







app.get("/register",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "register.html"
        )
    );

});








app.get("/online-payment",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "views",
            "online-payment.html"
        )
    );

});







app.get("/payment-success",(req,res)=>{


    res.sendFile(

        path.join(
            __dirname,
            "public",
            "views",
            "payment-success.html"
        )

    );


});











// =========================
// ADMIN LOGIN
// =========================


app.post("/login",async(req,res)=>{


    const {
        email,
        password
    } = req.body;



    try{


        const admin =
        await Admin.findOne({
            email
        });




        if(!admin){

            return res.json({

                success:false,

                message:"Invalid Email or Password"

            });

        }





        const match =
        await bcrypt.compare(
            password,
            admin.password
        );





        if(!match){

            return res.json({

                success:false,

                message:"Invalid Email or Password"

            });

        }





        req.session.admin=true;

        req.session.adminId =
        admin._id;




        res.json({

            success:true,

            message:"Login Successful"

        });



    }

    catch(error){


        console.log(error);


        res.json({

            success:false,

            message:"Server Error"

        });


    }


});











// Logout


app.get("/logout",(req,res)=>{


    req.session.destroy(()=>{

        res.redirect("/login");

    });


});









// =========================
// API ROUTES
// =========================



// Members

app.use(
    "/members",
    memberRoutes
);





// Payments

app.use(
    "/payments",
    authMiddleware,
    paymentRoutes
);





// Payment Gateway

app.use(
    "/payment",
    paymentGatewayRoutes
);





// Attendance

app.use(
    "/attendance",
    authMiddleware,
    attendanceRoutes
);





// Dashboard

app.use(
    "/dashboard",
    authMiddleware,
    dashboardRoutes
);






// Trainer API

app.use(
    "/trainers",
    trainerRoutes
);







// Plan API

app.use(
    "/plans",
    planRoutes
);








// Reminder

app.use(
    "/",
    reminderRoutes
);










// =========================
// TRAINER PAGE
// =========================


app.get(
"/trainer",
authMiddleware,
(req,res)=>{


    res.sendFile(

        path.join(

            __dirname,

            "public",

            "views",

            "trainer.html"

        )

    );


});











// =========================
// PLANS PAGE
// =========================


app.get(
"/plans-management",
authMiddleware,
(req,res)=>{


    res.sendFile(

        path.join(

            __dirname,

            "public",

            "views",

            "plans.html"

        )

    );


});












// =========================
// ADMIN PROFILE
// =========================


app.get(
"/admin-profile",
authMiddleware,
async(req,res)=>{


    try{


        const admin =

        await Admin.findById(
            req.session.adminId
        )
        .select("-password");





        if(!admin){

            return res.json({

                success:false,

                message:"Admin not found"

            });

        }





        res.json({

            success:true,

            admin

        });



    }

    catch(error){


        console.log(error);


        res.json({

            success:false,

            message:"Server Error"

        });


    }


});












// SERVER


const PORT =
process.env.PORT || 8000;



app.listen(PORT,()=>{


    console.log(
        `🚀 Server Running on Port ${PORT}`
    );


});