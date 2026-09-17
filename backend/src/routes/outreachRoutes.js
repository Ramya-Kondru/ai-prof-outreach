const express = require("express");

const {
    createOutreachForPatient
} = require("../controllers/outreachController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER"
    ),
    createOutreachForPatient
);

module.exports = router;