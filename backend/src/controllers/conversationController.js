const Conversation = require("../models/Conversation");
const Outreach = require("../models/Outreach");
const Campaign = require("../models/Campaign");

// ======================================================
// AI CONVERSATION REPLY
// ======================================================

const generateConversationReply = async ({
    campaignName,
    conversationHistory,
    patientMessage
}) => {

    // --------------------------------------------------
    // TEMPORARY AI LOGIC
    // Replace this with your actual AI API/service
    // --------------------------------------------------

    const message = patientMessage.toLowerCase();

    if (
        message.includes("yes") ||
        message.includes("okay") ||
        message.includes("sure")
    ) {
        return `Thank you for confirming. We are glad to hear from you regarding the ${campaignName || "follow-up"} program. Our team will assist you with the next steps.`;
    }

    if (
        message.includes("no") ||
        message.includes("not interested")
    ) {
        return `Thank you for letting us know. We have recorded your response. If you need any assistance in the future, please feel free to contact the hospital.`;
    }

    if (
        message.includes("appointment") ||
        message.includes("doctor")
    ) {
        return `We understand that you would like assistance with your appointment. Our hospital team can help you with scheduling and further information.`;
    }

    return `Thank you for your message. We have received your response regarding the ${campaignName || "follow-up"} program. Our team will assist you further.`;
};


// ======================================================
// CREATE CONVERSATION
// ======================================================

const createConversation = async (req, res) => {

    try {

        const {
            outreachId,
            patientId
        } = req.body;


        // --------------------------------------------------
        // Validate
        // --------------------------------------------------

        if (!outreachId || !patientId) {

            return res.status(400).json({
                message:
                    "outreachId and patientId are required"
            });

        }


        // --------------------------------------------------
        // Find outreach
        // --------------------------------------------------

        const outreach =
            await Outreach.findOne({

                _id: outreachId,

                hospitalId:
                    req.user.hospitalId

            });


        if (!outreach) {

            return res.status(404).json({
                message:
                    "Outreach not found"
            });

        }


        // --------------------------------------------------
        // Check existing conversation
        // --------------------------------------------------

        const existingConversation =
            await Conversation.findOne({
                outreachId
            });


        if (existingConversation) {

            return res.status(200).json({

                message:
                    "Conversation already exists",

                conversation:
                    existingConversation

            });

        }


        // --------------------------------------------------
        // AI starts conversation
        // using outreach.message
        // --------------------------------------------------

        const initialMessages = [];


        if (outreach.message) {

            initialMessages.push({

                sender: "AI",

                message:
                    outreach.message,

                sentAt:
                    new Date()

            });

        }


        // --------------------------------------------------
        // Create conversation
        // --------------------------------------------------

        const conversation =
            await Conversation.create({

                hospitalId:
                    req.user.hospitalId,

                patientId,

                outreachId,

                status: "OPEN",

                messages:
                    initialMessages

            });


        res.status(201).json({

            message:
                "Conversation created successfully",

            conversation

        });


    } catch (error) {

        console.error(
            "Create conversation error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error"
        });

    }

};


// ======================================================
// GET CONVERSATION BY OUTREACH
// ======================================================

const getConversation = async (req, res) => {

    try {

        const conversation =
            await Conversation.findOne({

                outreachId:
                    req.params.outreachId,

                hospitalId:
                    req.user.hospitalId

            })

                .populate(
                    "patientId",
                    "patientId name phone"
                )

                .populate(
                    "outreachId",
                    "status outcome attemptNumber message"
                );


        if (!conversation) {

            return res.status(404).json({

                message:
                    "Conversation not found"

            });

        }


        res.json({

            conversation

        });


    } catch (error) {

        console.error(
            "Get conversation error:",
            error.message
        );

        res.status(500).json({

            message:
                "Server error"

        });

    }

};


// ======================================================
// ADD MESSAGE
// ======================================================

const addMessage = async (req, res) => {

    try {

        const {
            sender,
            message
        } = req.body;


        // --------------------------------------------------
        // Validate
        // --------------------------------------------------

        if (!sender || !message) {

            return res.status(400).json({

                message:
                    "sender and message are required"

            });

        }


        // --------------------------------------------------
        // Only these senders are allowed
        // --------------------------------------------------

        const allowedSenders = [

            "PATIENT",
            "HOSPITAL"

        ];


        if (!allowedSenders.includes(sender)) {

            return res.status(400).json({

                message:
                    "Invalid sender"

            });

        }


        // --------------------------------------------------
        // Find conversation
        // --------------------------------------------------

        const conversation =
            await Conversation.findOne({

                _id:
                    req.params.conversationId,

                hospitalId:
                    req.user.hospitalId

            });


        if (!conversation) {

            return res.status(404).json({

                message:
                    "Conversation not found"

            });

        }


        // --------------------------------------------------
        // Don't allow messages after resolved
        // --------------------------------------------------

        if (
            conversation.status ===
            "RESOLVED"
        ) {

            return res.status(400).json({

                message:
                    "Cannot add message to a resolved conversation"

            });

        }


        // --------------------------------------------------
        // Add PATIENT / HOSPITAL message
        // --------------------------------------------------

        conversation.messages.push({

            sender,

            message:
                message.trim(),

            sentAt:
                new Date()

        });


        await conversation.save();


        // ==================================================
        // PATIENT MESSAGE → AI REPLY
        // ==================================================

        if (sender === "PATIENT") {


            // --------------------------------------------------
            // Get outreach
            // --------------------------------------------------

            const outreach =
                await Outreach.findOne({

                    _id:
                        conversation.outreachId,

                    hospitalId:
                        req.user.hospitalId

                });


            if (!outreach) {

                return res.status(404).json({

                    message:
                        "Outreach not found"

                });

            }


            // --------------------------------------------------
            // Get campaign
            // --------------------------------------------------

            const campaign =
                await Campaign.findOne({

                    _id:
                        outreach.campaignId,

                    hospitalId:
                        req.user.hospitalId

                });


            // --------------------------------------------------
            // Conversation history
            // --------------------------------------------------

            const conversationHistory =
                conversation.messages
                    .map((item) => {

                        return `${item.sender}: ${item.message}`;

                    })
                    .join("\n");


            // --------------------------------------------------
            // Generate AI response
            // --------------------------------------------------

            const aiReply =
                await generateConversationReply({

                    campaignName:
                        campaign?.name,

                    conversationHistory,

                    patientMessage:
                        message

                });


            // --------------------------------------------------
            // Save AI reply
            // --------------------------------------------------

            conversation.messages.push({

                sender: "AI",

                message:
                    aiReply,

                sentAt:
                    new Date()

            });


            await conversation.save();

        }


        // --------------------------------------------------
        // Return updated conversation
        // --------------------------------------------------

        res.json({

            message:
                "Message added successfully",

            conversation

        });


    } catch (error) {

        console.error(
            "Add conversation message error:",
            error.message
        );

        res.status(500).json({

            message:
                "Server error"

        });

    }

};


// ======================================================
// RESOLVE CONVERSATION
// ======================================================

const closeConversation = async (req, res) => {

    try {

        const conversation =
            await Conversation.findOne({

                _id:
                    req.params.conversationId,

                hospitalId:
                    req.user.hospitalId

            });


        if (!conversation) {

            return res.status(404).json({

                message:
                    "Conversation not found"

            });

        }


        // --------------------------------------------------
        // Change OPEN → RESOLVED
        // --------------------------------------------------

        conversation.status =
            "RESOLVED";


        await conversation.save();


        res.json({

            message:
                "Conversation resolved successfully",

            conversation

        });


    } catch (error) {

        console.error(
            "Resolve conversation error:",
            error.message
        );

        res.status(500).json({

            message:
                "Server error"

        });

    }

};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    createConversation,

    getConversation,

    addMessage,

    closeConversation

};