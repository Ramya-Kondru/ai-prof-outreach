const Patient = require("../models/Patient");
const Campaign = require("../models/Campaign");
const Outreach = require("../models/Outreach");

const { checkEligibility } = require("../services/eligibilityService");
const { createOutreach } = require("../services/outreachService");


// ======================================================
// CREATE OUTREACH
// ======================================================

const createOutreachForPatient = async (req, res) => {

    try {

        const {
            patientId,
            campaignId,
            scheduledAt
        } = req.body;


        // ------------------------------------------------
        // Validate input
        // ------------------------------------------------

        if (!patientId || !campaignId) {

            return res.status(400).json({
                message:
                    "patientId and campaignId are required"
            });
        }


        // ------------------------------------------------
        // Find patient
        // ------------------------------------------------

        const patient = await Patient.findOne({

            _id: patientId,

            hospitalId:
                req.user.hospitalId

        });


        if (!patient) {

            return res.status(404).json({
                message:
                    "Patient not found"
            });
        }


        // ------------------------------------------------
        // Find campaign
        // ------------------------------------------------

        const campaign = await Campaign.findOne({

            _id: campaignId,

            hospitalId:
                req.user.hospitalId

        });


        if (!campaign) {

            return res.status(404).json({
                message:
                    "Campaign not found"
            });
        }


        // ------------------------------------------------
        // Check eligibility
        // ------------------------------------------------

        const eligibility =
            checkEligibility(
                patient,
                campaign
            );


        if (!eligibility.eligible) {

            return res.status(400).json({

                message:
                    "Patient is not eligible for outreach",

                reason:
                    eligibility.reason

            });
        }


        // ------------------------------------------------
        // Create outreach
        // ------------------------------------------------

        const result =
            await createOutreach({

                hospitalId:
                    req.user.hospitalId,

                patientId:
                    patient._id,

                campaignId:
                    campaign._id,

                scheduledAt:
                    scheduledAt ||
                    new Date()

            });


        const outreach =
            result.outreach;

        const conversation =
            result.conversation;


        // ------------------------------------------------
        // SUCCESS RESPONSE
        // ------------------------------------------------

        return res.status(201).json({

            message:
                "Outreach queued successfully",

            outreach,

            conversation

        });


    } catch (error) {

        console.error(
            "Create outreach error:",
            error.message
        );


        // Prevent sending another response
        // if Express has already sent one

        if (res.headersSent) {
            return;
        }


        return res.status(500).json({

            message:
                "Server error"

        });

    }
};



// ======================================================
// GET OUTREACH
// ======================================================

const getOutreach = async (req, res) => {

    try {

        const outreach =
            await Outreach.find({

                hospitalId:
                    req.user.hospitalId

            })

                .populate(
                    "patientId",
                    "patientId name phone"
                )

                .populate(
                    "campaignId",
                    "name status priority"
                )

                .sort({
                    createdAt: -1
                });


        return res.json({

            count:
                outreach.length,

            outreach

        });


    } catch (error) {

        console.error(
            "Get outreach error:",
            error.message
        );


        if (res.headersSent) {
            return;
        }


        return res.status(500).json({

            message:
                "Server error"

        });

    }
};



// ======================================================
// COMPLETE / FAIL OUTREACH
// ======================================================

const completeOutreach = async (req, res) => {

    try {

        const {
            status,
            outcome,
            failureReason,
            callbackAt
        } = req.body;


        // ------------------------------------------------
        // Allowed statuses
        // ------------------------------------------------

        const allowedStatuses = [

            "COMPLETED",
            "FAILED",
            "CANCELLED"

        ];


        // ------------------------------------------------
        // Allowed outcomes
        // ------------------------------------------------

        const allowedOutcomes = [

            "CONNECTED",
            "NO_ANSWER",
            "BUSY",
            "VOICEMAIL",
            "DROPPED",
            "FAILED",
            "CALLBACK_REQUESTED",
            "ESCALATED"

        ];


        // ------------------------------------------------
        // Validate status
        // ------------------------------------------------

        if (
            !status ||
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid outreach status"

            });
        }


        // ------------------------------------------------
        // Validate outcome
        // ------------------------------------------------

        if (
            outcome &&
            !allowedOutcomes.includes(outcome)
        ) {

            return res.status(400).json({

                message:
                    "Invalid outreach outcome"

            });
        }


        // ------------------------------------------------
        // Find outreach
        // ------------------------------------------------

        const outreach =
            await Outreach.findOne({

                _id:
                    req.params.outreachId,

                hospitalId:
                    req.user.hospitalId

            });


        if (!outreach) {

            return res.status(404).json({

                message:
                    "Outreach not found"

            });
        }


        // ------------------------------------------------
        // Check current status
        // ------------------------------------------------

        if (

            outreach.status !==
                "IN_PROGRESS" &&

            outreach.status !==
                "MANUAL_FOLLOW_UP"

        ) {

            return res.status(400).json({

                message:
                    "Only in-progress or manual follow-up outreach can be completed"

            });
        }


        // ------------------------------------------------
        // Find campaign
        // ------------------------------------------------

        const campaign =
            await Campaign.findOne({

                _id:
                    outreach.campaignId,

                hospitalId:
                    req.user.hospitalId

            });


        if (!campaign) {

            return res.status(404).json({

                message:
                    "Campaign not found"

            });
        }



        // ==================================================
        // SUCCESSFUL OUTREACH
        // ==================================================

        if (
            status ===
            "COMPLETED"
        ) {

            outreach.status =
                "COMPLETED";

            outreach.outcome =
                outcome ||
                "CONNECTED";

            outreach.completedAt =
                new Date();


            await outreach.save();


            return res.json({

                message:
                    "Outreach completed successfully",

                outreach

            });
        }



        // ==================================================
        // CALLBACK REQUESTED
        // ==================================================

        if (

            status === "FAILED" &&

            outcome ===
                "CALLBACK_REQUESTED"

        ) {

            if (!callbackAt) {

                return res.status(400).json({

                    message:
                        "callbackAt is required for callback"

                });
            }


            outreach.status =
                "QUEUED";

            outreach.outcome =
                "CALLBACK_REQUESTED";

            outreach.callbackAt =
                new Date(callbackAt);

            outreach.retryAt =
                null;


            await outreach.save();


            return res.json({

                message:
                    "Callback scheduled successfully",

                outreach

            });
        }



        // ==================================================
        // FAILED OUTREACH
        // ==================================================

        if (
            status ===
            "FAILED"
        ) {

            outreach.outcome =
                outcome ||
                "FAILED";


            outreach.failureReason =
                failureReason ||
                null;


            const maxAttempts =
                campaign.retryPolicy?.maxAttempts ||
                outreach.maxAttempts ||
                3;


            const baseBackoffMinutes =
                campaign.retryPolicy?.backoffMinutes ||
                15;


            // ------------------------------------------------
            // Retry available
            // ------------------------------------------------

            if (
                outreach.attemptNumber <
                maxAttempts
            ) {

                const delayMinutes =
                    baseBackoffMinutes *
                    Math.pow(
                        2,
                        outreach.attemptNumber - 1
                    );


                outreach.attemptNumber +=
                    1;


                outreach.status =
                    "QUEUED";


                outreach.retryAt =
                    new Date(

                        Date.now() +

                        delayMinutes *
                        60 *
                        1000

                    );


                await outreach.save();


                return res.json({

                    message:
                        `Outreach failed. Retry scheduled after ${delayMinutes} minutes`,

                    outreach

                });
            }



            // ==================================================
            // MAXIMUM ATTEMPTS REACHED
            // ==================================================

            outreach.status =
                "MANUAL_FOLLOW_UP";


            outreach.manualFollowUpRequired =
                true;


            outreach.manualFollowUpReason =
                `Maximum attempts (${maxAttempts}) reached`;


            outreach.completedAt =
                new Date();


            await outreach.save();


            return res.json({

                message:
                    "Maximum attempts reached. Manual follow-up required",

                outreach

            });
        }



        // ==================================================
        // CANCELLED
        // ==================================================

        if (
            status ===
            "CANCELLED"
        ) {

            outreach.status =
                "CANCELLED";


            outreach.completedAt =
                new Date();


            await outreach.save();


            return res.json({

                message:
                    "Outreach cancelled",

                outreach

            });
        }


    } catch (error) {

        console.error(
            "Complete outreach error:",
            error.message
        );


        if (res.headersSent) {
            return;
        }


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

    createOutreachForPatient,

    getOutreach,

    completeOutreach

};