const Patient = require("../models/Patient");
const Campaign = require("../models/Campaign");
const { checkEligibility } = require("../services/eligibilityService");
const { createOutreach } = require("../services/outreachService");

const createOutreachForPatient = async (req, res) => {
    try {
        const { patientId, campaignId, scheduledAt } = req.body;

        if (!patientId || !campaignId) {
            return res.status(400).json({
                message: "patientId and campaignId are required"
            });
        }

        const patient = await Patient.findOne({
            _id: patientId,
            hospitalId: req.user.hospitalId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const campaign = await Campaign.findOne({
            _id: campaignId,
            hospitalId: req.user.hospitalId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "Campaign not found"
            });
        }

        const eligibility = checkEligibility(
            patient,
            campaign
        );

        if (!eligibility.eligible) {
            return res.status(400).json({
                message: "Patient is not eligible for outreach",
                reason: eligibility.reason
            });
        }

        const outreach = await createOutreach({
            hospitalId: req.user.hospitalId,
            patientId: patient._id,
            campaignId: campaign._id,
            scheduledAt: scheduledAt || new Date()
        });

        res.status(201).json({
            message: "Outreach queued successfully",
            outreach
        });

    } catch (error) {
        console.error(
            "Create outreach error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createOutreachForPatient
};