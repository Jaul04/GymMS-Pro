const express = require("express");

const router = express.Router();

const reminderController =
require("../controllers/reminderController");


router.get(
    "/send-expiry-reminders",
    reminderController.sendExpiryReminders
);


module.exports = router;