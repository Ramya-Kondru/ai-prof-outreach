const Communication = require("../models/Communication");
const Observation = require("../models/Observation");
const FollowUp = require("../models/FollowUp");
const Escalation = require("../models/Escalation");
const Patient = require("../models/Patient");


// ======================================================
// VERIFY PATIENT BELONGS TO HOSPITAL
// ======================================================

const verifyPatient = async (patientId, hospitalId) => {

    return await Patient.findOne({
        _id: patientId,
        hospitalId
    });

};


// ======================================================
// GET COMMUNICATIONS FOR PATIENT
// ======================================================

const getPatientCommunications = async (req, res) => {

    try {

        const { patientId } = req.params;

        const patient =
            await verifyPatient(
                patientId,
                req.user.hospitalId
            );

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        const communications =
            await Communication.find({

                patientId,

                hospitalId:
                    req.user.hospitalId

            })
            .sort({
                communicatedAt: -1
            });

        return res.json({

            count:
                communications.length,

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
// GET OBSERVATIONS FOR PATIENT
// ======================================================

const getPatientObservations = async (req, res) => {

    try {

        const { patientId } = req.params;

        const patient =
            await verifyPatient(
                patientId,
                req.user.hospitalId
            );

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        const observations =
            await Observation.find({

                patientId,

                hospitalId:
                    req.user.hospitalId

            })
            .sort({
                observedAt: -1
            });

        return res.json({

            count:
                observations.length,

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
// GET FOLLOW-UPS FOR PATIENT
// ======================================================

const getPatientFollowUps = async (req, res) => {

    try {

        const { patientId } = req.params;

        const patient =
            await verifyPatient(
                patientId,
                req.user.hospitalId
            );

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        const followUps =
            await FollowUp.find({

                patientId,

                hospitalId:
                    req.user.hospitalId

            })
            .sort({
                createdAt: -1
            });

        return res.json({

            count:
                followUps.length,

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
// GET ESCALATIONS FOR PATIENT
// ======================================================

const getPatientEscalations = async (req, res) => {

    try {

        const { patientId } = req.params;

        const patient =
            await verifyPatient(
                patientId,
                req.user.hospitalId
            );

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        const escalations =
            await Escalation.find({

                patientId,

                hospitalId:
                    req.user.hospitalId

            })
            .sort({
                createdAt: -1
            });

        return res.json({

            count:
                escalations.length,

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

    getPatientCommunications,

    getPatientObservations,

    getPatientFollowUps,

    getPatientEscalations

};