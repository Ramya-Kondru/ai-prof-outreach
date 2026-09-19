const express = require("express");

const router = express.Router();

const {
    runTriage,
    getLatestTriage
} = require("../controllers/triageController");

const protect =
    require("../middleware/authMiddleware");


// ======================================================
// RUN TRIAGE
// ======================================================

router.post(
    "/:conversationId",
    protect,
    runTriage
);


// ======================================================
// GET LATEST TRIAGE
// ======================================================

router.get(
    "/:conversationId",
    protect,
    getLatestTriage
);


module.exports = router;