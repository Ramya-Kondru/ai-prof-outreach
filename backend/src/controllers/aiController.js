const {
    generateOutreachMessage
} = require("../services/aiService");


// ======================================================
// GENERATE AI OUTREACH MESSAGE
// ======================================================

const generateMessage = async (req, res) => {

    try {

        const {
            campaignName,
            campaignPurpose,
            outcome,
            followUpContext
        } = req.body;


        // ------------------------------------------------
        // Validate request
        // ------------------------------------------------

        if (!campaignName) {

            return res.status(400).json({
                message: "campaignName is required"
            });
        }


        // ------------------------------------------------
        // Generate AI message
        // ------------------------------------------------

        const message =
            await generateOutreachMessage({

                campaignName,

                campaignPurpose,

                outcome,

                followUpContext

            });


        // ------------------------------------------------
        // Return generated message
        // ------------------------------------------------

        res.json({

            message:
                "AI outreach message generated successfully",

            generatedMessage:
                message

        });

    } catch (error) {

        console.error(
            "Generate AI message error:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to generate AI outreach message"

        });
    }
};


module.exports = {
    generateMessage
};