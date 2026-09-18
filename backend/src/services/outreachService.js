const Outreach = require("../models/Outreach");
const Campaign = require("../models/Campaign");
const Conversation = require("../models/Conversation");

const {
    generateOutreachMessage
} = require("./aiService");


// ======================================================
// CREATE OUTREACH
// ======================================================

const createOutreach = async ({
    hospitalId,
    patientId,
    campaignId,
    scheduledAt
}) => {

    // --------------------------------------------------
    // 1. Find campaign
    // --------------------------------------------------

    const campaign = await Campaign.findOne({
        _id: campaignId,
        hospitalId
    });

    if (!campaign) {
        throw new Error("Campaign not found");
    }


    // --------------------------------------------------
    // 2. Get maximum attempts
    // --------------------------------------------------

    const maxAttempts =
        campaign.retryPolicy?.maxAttempts || 3;


    // --------------------------------------------------
    // 3. Generate AI outreach message
    // --------------------------------------------------

    let aiMessage = "";

    try {

        aiMessage = await generateOutreachMessage({

            campaignName:
                campaign.name,

            campaignPurpose:
                campaign.description,

            outcome:
                "No previous outcome",

            followUpContext:
                "Initial patient outreach"

        });

    } catch (error) {

        console.error(
            "AI message generation failed:",
            error.message
        );

        /*
         * Outreach creation should not fail
         * just because AI generation failed.
         */

        aiMessage = "";
    }


    // --------------------------------------------------
    // 4. Create outreach
    // --------------------------------------------------

    const outreach = await Outreach.create({

        hospitalId,

        patientId,

        campaignId,

        status: "QUEUED",

        priority:
            campaign.priority || 5,

        attemptNumber: 1,

        maxAttempts,

        scheduledAt,

        // IMPORTANT:
        // Save AI-generated message in aiMessage
        aiMessage:
            aiMessage || undefined

    });


    // --------------------------------------------------
    // 5. Create conversation
    // --------------------------------------------------

    const conversation =
        await Conversation.create({

            hospitalId,

            patientId,

            outreachId:
                outreach._id,

            messages:
                aiMessage
                    ? [
                        {
                            sender: "AI",

                            message:
                                aiMessage,

                            sentAt:
                                new Date()
                        }
                    ]
                    : [],

            status: "OPEN"

        });


    // --------------------------------------------------
    // 6. Return both records
    // --------------------------------------------------

    return {

        outreach,

        conversation

    };
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    createOutreach
};