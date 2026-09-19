const Conversation = require("../models/Conversation");
const Outreach = require("../models/Outreach");
const Campaign = require("../models/Campaign");

const {
    createCommunication
} = require("../services/ehrService");

const {
    performClinicalTriage
} = require("../services/clinicalTriageService");


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
    // Replace with actual AI API/service later
    // --------------------------------------------------

    const message =
        patientMessage.toLowerCase();


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

                outreachId,

                hospitalId:
                    req.user.hospitalId

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
        // AI initial message
        // --------------------------------------------------

        const initialMessages = [];


        if (outreach.aiMessage) {

            initialMessages.push({

                sender: "AI",

                message:
                    outreach.aiMessage,

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


        // ==================================================
        // DOCUMENT INITIAL AI MESSAGE IN MOCK EHR
        // ==================================================

        if (outreach.aiMessage) {

            await createCommunication({

                hospitalId:
                    req.user.hospitalId,

                patientId,

                outreachId,

                conversationId:
                    conversation._id,

                sender: "AI",

                message:
                    outreach.aiMessage,

                direction: "OUTBOUND",

                channel: "CHAT"

            });

        }


        // --------------------------------------------------
        // Return conversation
        // --------------------------------------------------

        return res.status(201).json({

            message:
                "Conversation created successfully",

            conversation

        });


    } catch (error) {

        console.error(
            "Create conversation error:",
            error.message
        );

        return res.status(500).json({

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
                    "status outcome attemptNumber aiMessage"
                );


        if (!conversation) {

            return res.status(404).json({

                message:
                    "Conversation not found"

            });

        }


        return res.json({

            conversation

        });


    } catch (error) {

        console.error(
            "Get conversation error:",
            error.message
        );

        return res.status(500).json({

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
        // Allowed senders
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
        // Clean message
        // --------------------------------------------------

        const cleanMessage =
            message.trim();


        if (!cleanMessage) {

            return res.status(400).json({

                message:
                    "Message cannot be empty"

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


        // ==================================================
        // ADD PATIENT / HOSPITAL MESSAGE
        // ==================================================

        conversation.messages.push({

            sender,

            message:
                cleanMessage,

            sentAt:
                new Date()

        });


        await conversation.save();


        // ==================================================
        // DOCUMENT MESSAGE IN MOCK EHR
        // ==================================================

        await createCommunication({

            hospitalId:
                req.user.hospitalId,

            patientId:
                conversation.patientId,

            outreachId:
                conversation.outreachId,

            conversationId:
                conversation._id,

            sender,

            message:
                cleanMessage,

            direction:
                sender === "PATIENT"
                    ? "INBOUND"
                    : "OUTBOUND",

            channel:
                "CHAT"

        });


        // ==================================================
        // STORE TRIAGE RESULT
        // ==================================================

        let triageResult = null;


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
            // Generate AI reply
            // --------------------------------------------------

            const aiReply =
                await generateConversationReply({

                    campaignName:
                        campaign?.name,

                    conversationHistory,

                    patientMessage:
                        cleanMessage

                });


            // ==================================================
            // SAVE AI REPLY TO CONVERSATION
            // ==================================================

            conversation.messages.push({

                sender: "AI",

                message:
                    aiReply,

                sentAt:
                    new Date()

            });


            await conversation.save();


            // ==================================================
            // DOCUMENT AI REPLY IN MOCK EHR
            // ==================================================

            await createCommunication({

                hospitalId:
                    req.user.hospitalId,

                patientId:
                    conversation.patientId,

                outreachId:
                    conversation.outreachId,

                conversationId:
                    conversation._id,

                sender: "AI",

                message:
                    aiReply,

                direction:
                    "OUTBOUND",

                channel:
                    "CHAT"

            });


            // ==================================================
            // CLINICAL TRIAGE
            // ==================================================

            triageResult =
                await performClinicalTriage({

                    hospitalId:
                        req.user.hospitalId,

                    patientId:
                        conversation.patientId,

                    outreachId:
                        conversation.outreachId,

                    conversationId:
                        conversation._id,

                    patientMessage:
                        cleanMessage

                });


            // ==================================================
            // LOG TRIAGE RESULT
            // ==================================================

            console.log(
                "Clinical triage result:",
                triageResult.triageResult
            );


            if (
                triageResult.escalation
            ) {

                console.log(
                    "Escalation created:",
                    triageResult.escalation._id
                );

            }


            if (
                triageResult.followUp
            ) {

                console.log(
                    "Follow-up created:",
                    triageResult.followUp._id
                );

            }

        }


        // ==================================================
        // RETURN UPDATED CONVERSATION + TRIAGE
        // ==================================================

        return res.json({

            message:
                "Message added successfully",

            conversation,

            triage:
                triageResult

        });


    } catch (error) {

        console.error(
            "Add conversation message error:",
            error.message
        );

        return res.status(500).json({

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
        // Check if already resolved
        // --------------------------------------------------

        if (
            conversation.status ===
            "RESOLVED"
        ) {

            return res.status(400).json({

                message:
                    "Conversation is already resolved"

            });

        }


        // --------------------------------------------------
        // Change OPEN → RESOLVED
        // --------------------------------------------------

        conversation.status =
            "RESOLVED";


        await conversation.save();


        // ==================================================
        // DOCUMENT RESOLUTION IN MOCK EHR
        // ==================================================

        await createCommunication({

            hospitalId:
                req.user.hospitalId,

            patientId:
                conversation.patientId,

            outreachId:
                conversation.outreachId,

            conversationId:
                conversation._id,

            sender:
                "HOSPITAL",

            message:
                "Conversation resolved by hospital.",

            direction:
                "OUTBOUND",

            channel:
                "CHAT"

        });


        // --------------------------------------------------
        // Return response
        // --------------------------------------------------

        return res.json({

            message:
                "Conversation resolved successfully",

            conversation

        });


    } catch (error) {

        console.error(
            "Resolve conversation error:",
            error.message
        );

        return res.status(500).json({

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