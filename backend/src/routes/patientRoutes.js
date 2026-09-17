const express = require("express");

const {
    createPatient,
    getPatients,
    checkPatientEligibility
} = require("../controllers/patientController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("HOSPITAL_ADMIN", "CAMPAIGN_MANAGER"),
    createPatient
);

router.get(
    "/",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER",
        "CLINICAL_REVIEWER"
    ),
    getPatients
);

router.get(
    "/:patientId/eligibility/:campaignId",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER",
        "CLINICAL_REVIEWER"
    ),
    checkPatientEligibility
);

module.exports = router;