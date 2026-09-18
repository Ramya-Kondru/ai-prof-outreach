const { processQueue } = require("../services/queueService");

const processOutreachQueue = async (req, res) => {
    try {

        const processed = await processQueue(
            req.user.hospitalId
        );

        res.json({
            message: "Queue processed successfully",
            count: processed.length,
            outreach: processed
        });

    } catch (error) {

        console.error(
            "Process outreach queue error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to process queue"
        });
    }
};

module.exports = {
    processOutreachQueue
};