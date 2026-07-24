const express = require("express");

const router = express.Router();

const path = require("path");


const dashboardController =
require("../controllers/dashboardController");



console.log("✅ Dashboard Routes Loaded");


router.get("/",(req,res)=>{


    res.sendFile(

        path.join(

            __dirname,

            "..",

            "views",

            "dashboard.html"

        )

    );


});

router.get(

    "/stats",

    dashboardController.getDashboardStats

);

router.get(

    "/recent-members",

    dashboardController.getRecentMembers

);


router.get(

    "/recent-payments",

    dashboardController.getRecentPayments

);


router.get(

    "/charts",

    dashboardController.getChartData

);








module.exports = router;