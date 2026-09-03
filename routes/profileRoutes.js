const express = require("express");
const router = express.Router();
const profile = require("../controllers/profileController");

router.get("/admin", profile.getAdminProfile);
router.put("/admin", profile.updateAdminProfile);
router.get("/member/:id", profile.getMemberProfile);
router.get("/trainer/:id", profile.getTrainerProfile);

module.exports = router;
