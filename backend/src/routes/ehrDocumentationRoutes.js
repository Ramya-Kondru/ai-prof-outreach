const express = require("express");

const {
    getPatientCommunications,
    getPatientObservations,
    getPatientFollowUps,
    getPatientEscalations
} = require("../controllers/ehrDocumentationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// COMMUNICATIONS
// ======================================================

router.get(
    "/patient/:patientId/communications",
    protect,
    getPatientCommunications
);


// ======================================================
// OBSERVATIONS
// ======================================================

router.get(
    "/patient/:patientId/observations",
    protect,
    getPatientObservations
);


// ======================================================
// FOLLOW-UPS
// ======================================================

router.get(
    "/patient/:patientId/followups",
    protect,
    getPatientFollowUps
);


// ======================================================
// ESCALATIONS
// ======================================================

router.get(
    "/patient/:patientId/escalations",
    protect,
    getPatientEscalations
);


module.exports = router;