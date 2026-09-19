const express = require("express");

const router = express.Router();

const {
    createConversation,
    getConversation,
    addMessage,
    closeConversation
} = require("../controllers/conversationController");

const {
    runTriage,
    getLatestTriage
} = require("../controllers/triageController");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");


// ======================================================
// CREATE CONVERSATION
// ======================================================

router.post(
    "/",
    protect,
    createConversation
);


// ======================================================
// GET CONVERSATION BY OUTREACH
// ======================================================

router.get(
    "/outreach/:outreachId",
    protect,
    getConversation
);


// ======================================================
// ADD MESSAGE
// ======================================================

router.post(
    "/:conversationId/messages",
    protect,
    addMessage
);


// ======================================================
// CLOSE CONVERSATION
// ======================================================

router.patch(
    "/:conversationId/close",
    protect,
    closeConversation
);


// ======================================================
// RUN CLINICAL TRIAGE
// ======================================================

router.post(
    "/:conversationId/triage",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER",
        "CLINICAL_REVIEWER"
    ),
    runTriage
);


// ======================================================
// GET LATEST TRIAGE ASSESSMENT
// ======================================================

router.get(
    "/:conversationId/triage",
    protect,
    authorize(
        "HOSPITAL_ADMIN",
        "CAMPAIGN_MANAGER",
        "CLINICAL_REVIEWER"
    ),
    getLatestTriage
);


module.exports = router;