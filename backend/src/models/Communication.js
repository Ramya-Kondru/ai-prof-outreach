const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema(
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
        // COMMUNICATION DETAILS
        // ==========================================

        sender: {
            type: String,
            enum: [
                "AI",
                "PATIENT",
                "HOSPITAL",
                "SYSTEM"
            ],
            required: true
        },

        channel: {
            type: String,
            enum: [
                "CHAT",
                "SMS",
                "PHONE",
                "EMAIL",
                "OTHER"
            ],
            default: "CHAT"
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        direction: {
            type: String,
            enum: [
                "INBOUND",
                "OUTBOUND"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "SENT",
                "DELIVERED",
                "FAILED"
            ],
            default: "SENT"
        },

        communicatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Communication",
    communicationSchema
);