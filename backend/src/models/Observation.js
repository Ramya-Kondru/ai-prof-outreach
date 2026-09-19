const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema(
    {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },

        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            index: true
        },

        outreachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Outreach"
        },

        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation"
        },

        // ==========================================
        // OBSERVATION
        // ==========================================

        type: {
            type: String,
            enum: [
                "SYMPTOM",
                "VITAL",
                "CLINICAL",
                "PATIENT_REPORTED",
                "AI_ASSESSMENT",
                "OTHER"
            ],
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        value: {
            type: String,
            required: true,
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

        status: {
            type: String,
            enum: [
                "NORMAL",
                "ABNORMAL",
                "UNKNOWN"
            ],
            default: "UNKNOWN"
        },

        observedAt: {
            type: Date,
            default: Date.now
        },

        source: {
            type: String,
            enum: [
                "PATIENT",
                "HOSPITAL",
                "AI",
                "SYSTEM"
            ],
            default: "PATIENT"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Observation",
    observationSchema
);