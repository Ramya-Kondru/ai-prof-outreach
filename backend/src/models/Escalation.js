const mongoose = require("mongoose");

const escalationSchema = new mongoose.Schema(
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
        // ESCALATION
        // ==========================================

        urgency: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "URGENT"
            ],
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        trigger: {
            type: String,
            enum: [
                "CLINICAL_TRIAGE",
                "PATIENT_REQUEST",
                "SYMPTOM",
                "RISK_FLAG",
                "MANUAL"
            ],
            required: true
        },

        requiresHumanReview: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: [
                "OPEN",
                "IN_REVIEW",
                "RESOLVED"
            ],
            default: "OPEN"
        },

        resolution: {
            type: String,
            trim: true
        },

        resolvedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Escalation",
    escalationSchema
);