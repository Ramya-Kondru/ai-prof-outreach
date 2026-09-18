const Campaign = require("../models/Campaign");
const Patient = require("../models/Patient");
const { checkEligibility } = require("../services/eligibilityService");

const createCampaign = async (req, res) => {
    try {
        const {
            name,
            description,
            startDate,
            endDate,
            followUpWindow,
            priority,
            callingHours,
            outboundCapacity,
            retryPolicy
        } = req.body;

        if (
            !name ||
            !startDate ||
            !endDate ||
            !followUpWindow
        ) {
            return res.status(400).json({
                message:
                    "name, startDate, endDate and followUpWindow are required"
            });
        }

        if (
            followUpWindow.minimumDaysAfterDischarge >
            followUpWindow.maximumDaysAfterDischarge
        ) {
            return res.status(400).json({
                message:
                    "Minimum follow-up days cannot be greater than maximum follow-up days"
            });
        }

        const campaign = await Campaign.create({
            hospitalId: req.user.hospitalId,
            name,
            description,
            startDate,
            endDate,
            followUpWindow,
            priority,
            callingHours,
            outboundCapacity,
            retryPolicy
        });

        res.status(201).json({
            message: "Campaign created successfully",
            campaign
        });

    } catch (error) {
        console.error("Create campaign error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({
            hospitalId: req.user.hospitalId
        }).sort({ createdAt: -1 });

        res.json({
            count: campaigns.length,
            campaigns
        });

    } catch (error) {
        console.error("Get campaigns error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getCampaignEligiblePatients = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            _id: req.params.campaignId,
            hospitalId: req.user.hospitalId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "Campaign not found"
            });
        }

        const patients = await Patient.find({
            hospitalId: req.user.hospitalId
        });

        const eligiblePatients = patients.filter((patient) => {
            const result = checkEligibility(
                patient,
                campaign
            );

            return result.eligible;
        });

        res.json({
            campaignId: campaign._id,
            campaignName: campaign.name,
            count: eligiblePatients.length,
            patients: eligiblePatients
        });

    } catch (error) {
        console.error(
            "Get eligible patients error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            _id: req.params.campaignId,
            hospitalId: req.user.hospitalId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "Campaign not found"
            });
        }

        const allowedStatuses = [
            "DRAFT",
            "ACTIVE",
            "PAUSED",
            "COMPLETED"
        ];

        if (
            req.body.status &&
            !allowedStatuses.includes(req.body.status)
        ) {
            return res.status(400).json({
                message: "Invalid campaign status"
            });
        }

        // Update status
        if (req.body.status) {
            campaign.status = req.body.status;
        }

        // Update priority
        if (req.body.priority !== undefined) {
            const priority = Number(req.body.priority);

            if (isNaN(priority) || priority < 1) {
                return res.status(400).json({
                    message: "Priority must be a positive number"
                });
            }

            campaign.priority = priority;
        }

        await campaign.save();

        res.json({
            message: "Campaign updated successfully",
            campaign
        });

    } catch (error) {
        console.error(
            "Update campaign error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createCampaign,
    getCampaigns,
    updateCampaign,
     getCampaignEligiblePatients
};