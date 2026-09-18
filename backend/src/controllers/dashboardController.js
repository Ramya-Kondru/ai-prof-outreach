const Campaign = require("../models/Campaign");
const Patient = require("../models/Patient");
const Outreach = require("../models/Outreach");

const getDashboardStats = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;

        const activeCampaigns = await Campaign.countDocuments({
            hospitalId,
            status: "ACTIVE"
        });

        const totalPatients = await Patient.countDocuments({
            hospitalId
        });

        const queuedOutreach = await Outreach.countDocuments({
            hospitalId,
            status: "QUEUED"
        });

        const completedOutreach = await Outreach.countDocuments({
            hospitalId,
            status: "COMPLETED"
        });

        res.json({
            activeCampaigns,
            totalPatients,
            queuedOutreach,
            completedOutreach
        });

    } catch (error) {
        console.error(
            "Dashboard stats error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboardStats
};