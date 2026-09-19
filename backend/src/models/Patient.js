const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
            index: true
        },

        // ==========================================
        // BASIC PATIENT INFORMATION
        // ==========================================

        patientId: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date
        },

        // ==========================================
        // DISCHARGE INFORMATION
        // ==========================================

        dischargeDate: {
            type: Date,
            required: true
        },

        dischargeDisposition: {
            type: String,
            enum: [
                "HOME",
                "TRANSFERRED",
                "SKILLED_NURSING",
                "OTHER"
            ],
            default: "HOME"
        },

        followUpRequired: {
            type: Boolean,
            default: true
        },

        communicationEligible: {
            type: Boolean,
            default: true
        },

        // ==========================================
        // CLINICAL INFORMATION
        // ==========================================

        clinicalData: {
            diagnosis: {
                type: String,
                trim: true
            },

            conditions: {
                type: [String],
                default: []
            },

            medications: {
                type: [String],
                default: []
            },

            allergies: {
                type: [String],
                default: []
            },

            symptoms: {
                type: [String],
                default: []
            },

            vitalSigns: {
                temperature: {
                    type: Number
                },

                heartRate: {
                    type: Number
                },

                bloodPressure: {
                    type: String,
                    trim: true
                },

                respiratoryRate: {
                    type: Number
                },

                oxygenSaturation: {
                    type: Number
                }
            },

            clinicalNotes: {
                type: String,
                trim: true
            }
        }
    },
    {
        timestamps: true
    }
);


// ==========================================
// UNIQUE PATIENT ID PER HOSPITAL
// ==========================================

patientSchema.index(
    {
        hospitalId: 1,
        patientId: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "Patient",
    patientSchema
);