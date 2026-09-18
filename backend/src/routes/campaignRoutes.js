const express = require("express");

const {
    createCampaign,
    getCampaigns,
    updateCampaign,
    getCampaignEligiblePatients
} = require("../controllers/campaignController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("HOSPITAL_ADMIN", "CAMPAIGN_MANAGER"),
    createCampaign
);

router.get(
    "/",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER",
        "CLINICAL_REVIEWER"
    ),
    getCampaigns
);

router.patch(
    "/:campaignId",
    protect,
    authorize("HOSPITAL_ADMIN", "CAMPAIGN_MANAGER"),
    updateCampaign
);

router.get(
    "/:campaignId/eligible-patients",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER",
        "CLINICAL_REVIEWER"
    ),
    getCampaignEligiblePatients
);

module.exports = router;