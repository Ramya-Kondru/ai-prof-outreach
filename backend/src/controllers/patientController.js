const Patient = require("../models/Patient");
const Campaign = require("../models/Campaign");
const { checkEligibility } = require("../services/eligibilityService");

const createPatient = async (req, res) => {
    try {
        const {
            patientId,
            name,
            phone,
            dateOfBirth,
            dischargeDate,
            dischargeDisposition,
            followUpRequired,
            communicationEligible
        } = req.body;

        if (!patientId || !name || !phone || !dischargeDate) {
            return res.status(400).json({
                message:
                    "patientId, name, phone and dischargeDate are required"
            });
        }

        const existingPatient = await Patient.findOne({
            hospitalId: req.user.hospitalId,
            patientId
        });

        if (existingPatient) {
            return res.status(409).json({
                message: "Patient already exists"
            });
        }

        const patient = await Patient.create({
            hospitalId: req.user.hospitalId,
            patientId,
            name,
            phone,
            dateOfBirth,
            dischargeDate,
            dischargeDisposition,
            followUpRequired,
            communicationEligible
        });

        res.status(201).json({
            message: "Patient created successfully",
            patient
        });

    } catch (error) {
        console.error("Create patient error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({
            hospitalId: req.user.hospitalId
        }).sort({ createdAt: -1 });

        res.json({
            count: patients.length,
            patients
        });

    } catch (error) {
        console.error("Get patients error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const checkPatientEligibility = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.patientId,
            hospitalId: req.user.hospitalId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const campaign = await Campaign.findOne({
            _id: req.params.campaignId,
            hospitalId: req.user.hospitalId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "Campaign not found"
            });
        }

        const result = checkEligibility(patient, campaign);

        res.json({
            patientId: patient.patientId,
            campaignId: campaign._id,
            ...result
        });

    } catch (error) {
        console.error(
            "Eligibility check error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createPatient,
    getPatients,
    checkPatientEligibility
};