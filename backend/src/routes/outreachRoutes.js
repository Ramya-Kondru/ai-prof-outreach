const express = require("express");

const {
    createOutreachForPatient,
    getOutreach,
    completeOutreach
} = require("../controllers/outreachController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER"
    ),
    getOutreach
);

router.post(
    "/",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER"
    ),
    createOutreachForPatient
);

router.patch(
    "/:outreachId",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER"
    ),
    completeOutreach
);

module.exports = router;