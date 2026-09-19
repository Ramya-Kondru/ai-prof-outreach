const EHR = require("../models/EHR");
const Patient = require("../models/Patient");

const Communication = require("../models/Communication");
const Observation = require("../models/Observation");
const FollowUp = require("../models/FollowUp");
const Escalation = require("../models/Escalation");
// ======================================================
// CREATE / UPDATE EHR
// ======================================================

const createOrUpdateEHR = async (req, res) => {
    try {
        const { patientId } = req.params;

        // ------------------------------------------------
        // Verify patient belongs to logged-in hospital
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
        // Find existing EHR
        // ------------------------------------------------

        let ehr = await EHR.findOne({
            patientId: patient._id
        });

        // ------------------------------------------------
        // Create new EHR
        // ------------------------------------------------

        if (!ehr) {
            ehr = new EHR({
                patientId: patient._id,
                ...req.body
            });

            await ehr.save();

            return res.status(201).json({
                message: "EHR created successfully",
                ehr
            });
        }

        // ------------------------------------------------
        // Update existing EHR
        // ------------------------------------------------

        Object.assign(ehr, req.body);

        await ehr.save();

        return res.json({
            message: "EHR updated successfully",
            ehr
        });

    } catch (error) {
        console.error(
            "Create/update EHR error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// GET EHR + DOCUMENTATION FOR PATIENT
// ======================================================

const getEHR = async (req, res) => {
    try {
        const { patientId } = req.params;

        // ------------------------------------------------
        // Verify patient belongs to logged-in hospital
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
        // Get EHR
        // ------------------------------------------------

        const ehr = await EHR.findOne({
            patientId: patient._id
        }).populate(
            "patientId",
            "patientId name phone email"
        );

        // ------------------------------------------------
        // Get documentation
        // ------------------------------------------------

        const [
            communications,
            observations,
            followUps,
            escalations
        ] = await Promise.all([

            Communication.find({
                hospitalId: req.user.hospitalId,
                patientId: patient._id
            }).sort({
                communicatedAt: -1
            }),

            Observation.find({
                hospitalId: req.user.hospitalId,
                patientId: patient._id
            }).sort({
                observedAt: -1
            }),

            FollowUp.find({
                hospitalId: req.user.hospitalId,
                patientId: patient._id
            }).sort({
                createdAt: -1
            }),

            Escalation.find({
                hospitalId: req.user.hospitalId,
                patientId: patient._id
            }).sort({
                createdAt: -1
            })

        ]);

        // ------------------------------------------------
        // Return complete patient record
        // ------------------------------------------------

        return res.json({

            patient,

            ehr,

            documentation: {

                communications,

                observations,

                followUps,

                escalations

            }

        });

    } catch (error) {

        console.error(
            "Get EHR error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });

    }
};

// ======================================================
// GET ALL EHR RECORDS
// ======================================================

const getAllEHR = async (req, res) => {
    try {
        // ------------------------------------------------
        // Get patients belonging to hospital
        // ------------------------------------------------

        const patients = await Patient.find({
            hospitalId: req.user.hospitalId
        }).select("_id");

        const patientIds = patients.map(
            patient => patient._id
        );

        // ------------------------------------------------
        // Get EHR records
        // ------------------------------------------------

        const ehrRecords = await EHR.find({
            patientId: {
                $in: patientIds
            }
        })
            .populate(
                "patientId",
                "patientId name phone email"
            )
            .sort({
                updatedAt: -1
            });

        return res.json({
            count: ehrRecords.length,
            ehr: ehrRecords
        });

    } catch (error) {
        console.error(
            "Get all EHR error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// DELETE EHR
// ======================================================

const deleteEHR = async (req, res) => {
    try {
        const { patientId } = req.params;

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
        // Delete EHR
        // ------------------------------------------------

        const ehr = await EHR.findOneAndDelete({
            patientId: patient._id
        });

        if (!ehr) {
            return res.status(404).json({
                message: "EHR not found"
            });
        }

        return res.json({
            message: "EHR deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete EHR error:",
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
    createOrUpdateEHR,
    getEHR,
    getAllEHR,
    deleteEHR
};