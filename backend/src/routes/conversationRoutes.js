const express = require("express");

const router = express.Router();

const {
    createConversation,
    getConversation,
    addMessage,
    closeConversation
} = require("../controllers/conversationController");

const protect = require("../middleware/authMiddleware");

router.post(
    "/",
    protect,
    createConversation
);

router.get(
    "/outreach/:outreachId",
    protect,
    getConversation
);

router.post(
    "/:conversationId/messages",
    protect,
    addMessage
);

router.patch(
    "/:conversationId/close",
    protect,
    closeConversation
);

module.exports = router;