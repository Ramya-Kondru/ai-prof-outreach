const express = require("express");

const {
    processOutreachQueue
} = require("../controllers/queueController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/process",
    protect,
    authorize("HOSPITAL_ADMIN", "CAMPAIGN_MANAGER"),
    processOutreachQueue
);

module.exports = router;