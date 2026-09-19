const express = require("express");

const {
    createFollowUp,
    completeFollowUp,
    cancelFollowUp
} = require("../controllers/followUpController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CREATE FOLLOW-UP
// ======================================================

router.post(
    "/",
    protect,
    createFollowUp
);


// ======================================================
// COMPLETE FOLLOW-UP
// ======================================================

router.patch(
    "/:followUpId/complete",
    protect,
    completeFollowUp
);


// ======================================================
// CANCEL FOLLOW-UP
// ======================================================

router.patch(
    "/:followUpId/cancel",
    protect,
    cancelFollowUp
);


module.exports = router;