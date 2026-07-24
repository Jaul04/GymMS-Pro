const express = require("express");
const router = express.Router();
const path = require("path");

const memberController = require("../controllers/memberController");


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "members.html"));
});


router.post("/add", memberController.addMember);

router.get("/all", memberController.getAllMembers);

router.get("/stats/dashboard", memberController.memberStats);

router.get("/:id", memberController.getMemberById);

router.put("/update/:id", memberController.updateMember);

router.delete("/delete/:id", memberController.deleteMember);

module.exports = router;