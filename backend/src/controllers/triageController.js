const Conversation =
    require("../models/Conversation");

const TriageAssessment =
    require("../models/TriageAssessment");

const {
    performClinicalTriage
} = require("../services/triageService");


// ======================================================
// RUN CLINICAL TRIAGE
// ======================================================

const runTriage = async (req, res) => {

    try {

        // ==================================================
        // FIND CONVERSATION
        // ==================================================

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


        // ==================================================
        // FIND LATEST PATIENT MESSAGE
        // ==================================================

        const patientMessages =
            conversation.messages?.filter(
                message =>
                    message.sender === "PATIENT"
            ) || [];


        if (patientMessages.length === 0) {

            return res.status(400).json({

                message:
                    "No patient message available for triage"

            });

        }


        const latestPatientMessage =
            patientMessages[
                patientMessages.length - 1
            ];


        // ==================================================
        // RUN CLINICAL TRIAGE
        // ==================================================

        const result =
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
                    latestPatientMessage.message

            });


        console.log(
            "Clinical triage result:",
            result.triageResult
        );


        // ==================================================
        // SAVE TRIAGE ASSESSMENT
        // ==================================================

        const assessment =
            await TriageAssessment.create({

                hospitalId:
                    req.user.hospitalId,

                patientId:
                    conversation.patientId,

                conversationId:
                    conversation._id,

                outreachId:
                    conversation.outreachId,

                urgency:
                    result.urgency,

                symptoms:
                    result.symptoms || [],

                redFlags:
                    result.redFlags || [],

                reasoning:
                    result.reason,

                recommendedAction:
                    result.recommendedAction ||
                    result.reason,

                requiresHumanReview:
                    result.requiresHumanReview,

                source:
                    "RULE_BASED_DEMO"

            });


        // ==================================================
        // RETURN RESULT
        // ==================================================

        return res.status(201).json({

            message:
                "Clinical triage completed successfully",

            assessment,

            triageResult:
                result.triageResult,

            escalation:
                result.escalation,

            followUp:
                result.followUp

        });


    } catch (error) {

        console.error(
            "Run triage error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error"

        });

    }

};


// ======================================================
// GET LATEST TRIAGE
// ======================================================

const getLatestTriage = async (req, res) => {

    try {

        const assessment =
            await TriageAssessment.findOne({

                conversationId:
                    req.params.conversationId,

                hospitalId:
                    req.user.hospitalId

            })
                .sort({
                    createdAt: -1
                });


        if (!assessment) {

            return res.status(404).json({

                message:
                    "No triage assessment found"

            });

        }


        return res.json({

            assessment

        });


    } catch (error) {

        console.error(
            "Get triage error:",
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

    runTriage,

    getLatestTriage

};