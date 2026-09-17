const express = require("express");

const {
    createCampaign,
    getCampaigns,
    updateCampaign
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

module.exports = router;