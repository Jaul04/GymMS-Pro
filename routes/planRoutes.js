const express = require("express");

const router = express.Router();


const planController =
require("../controllers/planController");



router.post(
"/add",
planController.addPlan
);



router.get(
"/",
planController.getPlans
);



module.exports = router;