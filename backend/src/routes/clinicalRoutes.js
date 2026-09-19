const express = require("express");

const {
    getCommunications,
    getObservations,
    getFollowUps,
    getEscalations
} = require("../controllers/clinicalRecordsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// COMMUNICATIONS
// ======================================================

router.get(
    "/communications",
    protect,
    getCommunications
);


// ======================================================
// OBSERVATIONS
// ======================================================

router.get(
    "/observations",
    protect,
    getObservations
);


// ======================================================
// FOLLOW-UPS
// ======================================================

router.get(
    "/follow-ups",
    protect,
    getFollowUps
);


// ======================================================
// ESCALATIONS
// ======================================================

router.get(
    "/escalations",
    protect,
    getEscalations
);


module.exports = router;