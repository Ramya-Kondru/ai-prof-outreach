const mongoose = require("mongoose");

const outreachSchema = new mongoose.Schema(
    {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
            index: true
        },

        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            index: true
        },

        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
            index: true
        },

        status: {
            type: String,
            enum: [
                "QUEUED",
                "IN_PROGRESS",
                "COMPLETED",
                "FAILED",
                "CANCELLED"
            ],
            default: "QUEUED"
        },

        attemptNumber: {
            type: Number,
            default: 1,
            min: 1
        },

        scheduledAt: {
            type: Date,
            required: true
        },

        startedAt: {
            type: Date
        },

        completedAt: {
            type: Date
        },

        outcome: {
            type: String,
            enum: [
                "CONNECTED",
                "NO_ANSWER",
                "BUSY",
                "VOICEMAIL",
                "FAILED",
                "ESCALATED"
            ]
        },

        failureReason: {
            type: String,
            trim: true
        },

        retryAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Outreach", outreachSchema);