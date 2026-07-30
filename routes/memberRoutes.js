const express = require("express");
const router = express.Router();
const path = require("path");

const memberController = require("../controllers/memberController");


// Members Page

router.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "public",
            "views",
            "members.html"
        )
    );

});


// Add Member

router.post(
    "/add",
    memberController.addMember
);


// Get All Members

router.get(
    "/all",
    memberController.getAllMembers
);


// Dashboard Member Stats

router.get(
    "/stats/dashboard",
    memberController.memberStats
);


// Get Single Member

router.get(
    "/:id",
    memberController.getMemberById
);


// Update Member

router.put(
    "/update/:id",
    memberController.updateMember
);


// Delete Member

router.delete(
    "/delete/:id",
    memberController.deleteMember
);


// Online Registration

router.post(
    "/register",
    memberController.registerMember
);


module.exports = router;