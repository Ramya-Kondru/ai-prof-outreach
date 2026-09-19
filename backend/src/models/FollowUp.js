const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
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
        // FOLLOW-UP
        // ==========================================

        type: {
            type: String,
            enum: [
                "CALL",
                "APPOINTMENT",
                "MEDICATION",
                "TEST",
                "MONITORING",
                "GENERAL"
            ],
            default: "GENERAL"
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        dueDate: {
            type: Date
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "COMPLETED",
                "CANCELLED"
            ],
            default: "PENDING"
        },

        notes: {
            type: String,
            trim: true
        },

        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "FollowUp",
    followUpSchema
);