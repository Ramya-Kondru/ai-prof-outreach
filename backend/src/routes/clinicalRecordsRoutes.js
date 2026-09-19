const express = require("express");

const router = express.Router();

const {
    getCommunications,
    getObservations,
    getFollowUps,
    getEscalations
} = require("../controllers/clinicalRecordsController");

const protect =
    require("../middleware/authMiddleware");


// ======================================================
// CLINICAL DOCUMENTATION ROUTES
// ======================================================

router.get(
    "/communications",
    protect,
    getCommunications
);

router.get(
    "/observations",
    protect,
    getObservations
);

router.get(
    "/follow-ups",
    protect,
    getFollowUps
);

router.get(
    "/escalations",
    protect,
    getEscalations
);


module.exports = router;