const FollowUp = require("../models/FollowUp");
const Patient = require("../models/Patient");

// ======================================================
// CREATE FOLLOW-UP
// ======================================================

const createFollowUp = async (req, res) => {
    try {
        const {
            patientId,
            outreachId,
            conversationId,
            type,
            reason,
            dueDate,
            notes
        } = req.body;

        // ------------------------------------------------
        // Validate required fields
        // ------------------------------------------------

        if (!patientId || !reason) {
            return res.status(400).json({
                message: "patientId and reason are required"
            });
        }

        // ------------------------------------------------
        // Verify patient belongs to hospital
        // ------------------------------------------------

        const patient = await Patient.findOne({
            _id: patientId,
            hospitalId: req.user.hospitalId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // ------------------------------------------------
        // Create follow-up
        // ------------------------------------------------

        const followUp = await FollowUp.create({
            hospitalId: req.user.hospitalId,
            patientId,
            outreachId,
            conversationId,
            type: type || "GENERAL",
            reason,
            dueDate,
            notes
        });

        // ------------------------------------------------
        // SUCCESS
        // ------------------------------------------------

        return res.status(201).json({
            message: "Follow-up created successfully",
            followUp
        });

    } catch (error) {

        console.error(
            "Create follow-up error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// COMPLETE FOLLOW-UP
// ======================================================

const completeFollowUp = async (req, res) => {
    try {

        const followUp = await FollowUp.findOne({
            _id: req.params.followUpId,
            hospitalId: req.user.hospitalId
        });

        if (!followUp) {
            return res.status(404).json({
                message: "Follow-up not found"
            });
        }

        if (followUp.status !== "PENDING") {
            return res.status(400).json({
                message:
                    "Only pending follow-ups can be completed"
            });
        }

        followUp.status = "COMPLETED";
        followUp.completedAt = new Date();

        await followUp.save();

        return res.json({
            message: "Follow-up completed successfully",
            followUp
        });

    } catch (error) {

        console.error(
            "Complete follow-up error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// CANCEL FOLLOW-UP
// ======================================================

const cancelFollowUp = async (req, res) => {
    try {

        const followUp = await FollowUp.findOne({
            _id: req.params.followUpId,
            hospitalId: req.user.hospitalId
        });

        if (!followUp) {
            return res.status(404).json({
                message: "Follow-up not found"
            });
        }

        if (followUp.status !== "PENDING") {
            return res.status(400).json({
                message:
                    "Only pending follow-ups can be cancelled"
            });
        }

        followUp.status = "CANCELLED";

        await followUp.save();

        return res.json({
            message: "Follow-up cancelled successfully",
            followUp
        });

    } catch (error) {

        console.error(
            "Cancel follow-up error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createFollowUp,
    completeFollowUp,
    cancelFollowUp
};