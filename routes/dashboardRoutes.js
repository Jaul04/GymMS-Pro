const express = require("express");

const router = express.Router();

const path = require("path");


const dashboardController =
require("../controllers/dashboardController");



console.log("✅ Dashboard Routes Loaded");



// Dashboard Page

router.get("/",(req,res)=>{


    res.sendFile(

        path.join(

            __dirname,

            "..",

            "public",

            "views",

            "dashboard.html"

        )

    );


});




// Dashboard Stats API

router.get(

    "/stats",

    dashboardController.getDashboardStats

);




// Recent Members

router.get(

    "/recent-members",

    dashboardController.getRecentMembers

);




// Recent Payments

router.get(

    "/recent-payments",

    dashboardController.getRecentPayments

);




// Charts Data

router.get(

    "/charts",

    dashboardController.getChartData

);



module.exports = router;