const mongoose = require("mongoose");

const ehrSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            unique: true,
            index: true
        },

        // ==============================
        // DEMOGRAPHICS
        // ==============================

        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"]
        },

        bloodGroup: {
            type: String,
            trim: true
        },

        // ==============================
        // MEDICAL INFORMATION
        // ==============================

        allergies: [
            {
                type: String,
                trim: true
            }
        ],

        chronicConditions: [
            {
                type: String,
                trim: true
            }
        ],

        currentMedications: [
            {
                name: {
                    type: String,
                    trim: true
                },

                dosage: {
                    type: String,
                    trim: true
                },

                frequency: {
                    type: String,
                    trim: true
                }
            }
        ],

        // ==============================
        // VITALS
        // ==============================

        vitals: {
            bloodPressure: {
                type: String,
                trim: true
            },

            heartRate: {
                type: Number
            },

            temperature: {
                type: Number
            },

            oxygenSaturation: {
                type: Number
            },

            weight: {
                type: Number
            }
        },

        // ==============================
        // LAB RESULTS
        // ==============================

        labResults: [
            {
                testName: {
                    type: String,
                    trim: true
                },

                value: {
                    type: String,
                    trim: true
                },

                unit: {
                    type: String,
                    trim: true
                },

                referenceRange: {
                    type: String,
                    trim: true
                },

                date: {
                    type: Date
                }
            }
        ],

        // ==============================
        // DIAGNOSES
        // ==============================

        diagnoses: [
            {
                condition: {
                    type: String,
                    trim: true
                },

                diagnosedAt: {
                    type: Date
                },

                status: {
                    type: String,
                    enum: [
                        "ACTIVE",
                        "RESOLVED",
                        "HISTORICAL"
                    ],
                    default: "ACTIVE"
                }
            }
        ],

        // ==============================
        // RECENT CLINICAL NOTES
        // ==============================

        clinicalNotes: [
            {
                note: {
                    type: String,
                    trim: true
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        // ==============================
        // EMERGENCY / RISK INFORMATION
        // ==============================

        emergencyContact: {
            name: {
                type: String,
                trim: true
            },

            phone: {
                type: String,
                trim: true
            },

            relationship: {
                type: String,
                trim: true
            }
        },

        riskFlags: [
            {
                type: String,
                trim: true
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("EHR", ehrSchema);