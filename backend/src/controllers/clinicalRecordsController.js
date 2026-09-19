const Communication = require("../models/Communication");
const Observation = require("../models/Observation");
const FollowUp = require("../models/FollowUp");
const Escalation = require("../models/Escalation");


// ======================================================
// GET COMMUNICATIONS
// ======================================================

const getCommunications = async (req, res) => {
    try {

        const communications =
            await Communication.find({
                hospitalId: req.user.hospitalId
            })
                .populate(
                    "patientId",
                    "patientId name phone"
                )
                .sort({
                    communicatedAt: -1
                });

        return res.json({
            count: communications.length,
            communications
        });

    } catch (error) {

        console.error(
            "Get communications error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// GET OBSERVATIONS
// ======================================================

const getObservations = async (req, res) => {
    try {

        const observations =
            await Observation.find({
                hospitalId: req.user.hospitalId
            })
                .populate(
                    "patientId",
                    "patientId name phone"
                )
                .sort({
                    observedAt: -1
                });

        return res.json({
            count: observations.length,
            observations
        });

    } catch (error) {

        console.error(
            "Get observations error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// GET FOLLOW-UPS
// ======================================================

const getFollowUps = async (req, res) => {
    try {

        const followUps =
            await FollowUp.find({
                hospitalId: req.user.hospitalId
            })
                .populate(
                    "patientId",
                    "patientId name phone"
                )
                .sort({
                    createdAt: -1
                });

        return res.json({
            count: followUps.length,
            followUps
        });

    } catch (error) {

        console.error(
            "Get follow-ups error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// GET ESCALATIONS
// ======================================================

const getEscalations = async (req, res) => {
    try {

        const escalations =
            await Escalation.find({
                hospitalId: req.user.hospitalId
            })
                .populate(
                    "patientId",
                    "patientId name phone"
                )
                .sort({
                    createdAt: -1
                });

        return res.json({
            count: escalations.length,
            escalations
        });

    } catch (error) {

        console.error(
            "Get escalations error:",
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

    getCommunications,
    getObservations,
    getFollowUps,
    getEscalations

};