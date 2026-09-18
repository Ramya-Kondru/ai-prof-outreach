const Hospital = require("../models/Hospital");

const getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find()
            .sort({ createdAt: -1 });

        res.json({
            count: hospitals.length,
            hospitals
        });

    } catch (error) {
        console.error(
            "Get hospitals error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


const createHospital = async (req, res) => {
    try {
        const {
            name,
            code,
            contactEmail,
            contactPhone,
            timezone,
            callingHours,
            outboundCapacity
        } = req.body;

        if (!name || !code || !contactEmail) {
            return res.status(400).json({
                message:
                    "Name, code and contact email are required"
            });
        }

        const existingHospital = await Hospital.findOne({
            code: code.toUpperCase()
        });

        if (existingHospital) {
            return res.status(409).json({
                message: "Hospital code already exists"
            });
        }

        const hospital = await Hospital.create({
            name,
            code: code.toUpperCase(),
            contactEmail,
            contactPhone,
            timezone,
            callingHours,
            outboundCapacity
        });

        res.status(201).json({
            message: "Hospital created successfully",
            hospital
        });

    } catch (error) {
        console.error(
            "Create hospital error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateHospitalStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "CONFIGURING",
            "READY",
            "INACTIVE"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid hospital status"
            });
        }

        const hospital = await Hospital.findById(
            req.params.hospitalId
        );

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        hospital.status = status;

        await hospital.save();

        res.json({
            message: "Hospital status updated successfully",
            hospital
        });

    } catch (error) {
        console.error(
            "Update hospital status error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getMyHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findById(
            req.user.hospitalId
        );

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        res.json({
            hospital
        });

    } catch (error) {
        console.error(
            "Get hospital error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getHospitals,
    createHospital,
    updateHospitalStatus,
    getMyHospital
};