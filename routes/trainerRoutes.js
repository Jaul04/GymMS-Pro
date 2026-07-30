const express = require("express");

const router = express.Router();


const trainerController =
require("../controllers/trainerController");



// Add Trainer
router.post(
"/add",
trainerController.addTrainer
);


// Get Trainers
router.get(
"/",
trainerController.getTrainers
);


// Get Single Trainer

router.get(
"/:id",
trainerController.getTrainerById
);


// Update Trainer

router.put(
"/:id",
trainerController.updateTrainer
);


// Delete Trainer

router.delete(
"/:id",
trainerController.deleteTrainer
);



module.exports = router;