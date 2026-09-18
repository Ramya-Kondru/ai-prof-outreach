const express = require("express");

const {
    generateMessage
} = require("../controllers/aiController");

const protect =
    require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// GENERATE AI OUTREACH MESSAGE
// ======================================================

router.post(
    "/generate-message",
    protect,
    generateMessage
);


module.exports = router;