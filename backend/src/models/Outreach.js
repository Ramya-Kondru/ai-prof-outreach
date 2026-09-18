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
                "RETRY_WAIT",
                "COMPLETED",
                "FAILED",
                "CANCELLED",
                "MANUAL_FOLLOW_UP"
            ],
            default: "QUEUED",
            index: true
        },

        /*
         * Higher priority number = processed earlier
         *
         * Example:
         * 10 = urgent
         * 5  = normal
         * 1  = low
         */
        priority: {
            type: Number,
            default: 5,
            index: true
        },

        attemptNumber: {
            type: Number,
            default: 1,
            min: 1
        },

        maxAttempts: {
            type: Number,
            default: 3,
            min: 1
        },

        scheduledAt: {
            type: Date,
            required: true,
            index: true
        },

        startedAt: {
            type: Date
        },

        completedAt: {
            type: Date
        },

        /*
         * Used when patient requests a callback.
         */
        callbackAt: {
            type: Date,
            index: true
        },

        /*
         * Used when retry should happen later.
         */
        retryAt: {
            type: Date,
            index: true
        },

        /*
         * Latest result of the outreach attempt.
         */
        outcome: {
            type: String,
            enum: [
                "CONNECTED",
                "NO_ANSWER",
                "BUSY",
                "VOICEMAIL",
                "DROPPED",
                "FAILED",
                "CALLBACK_REQUESTED",
                "ESCALATED"
            ]
        },
        message: {
    type: String,
    trim: true
},

        /*
         * AI-generated patient outreach message.
         */
        aiMessage: {
            type: String,
            trim: true
        },

        failureReason: {
            type: String,
            trim: true
        },

        /*
         * Clinical deadline for completing the outreach.
         */
        clinicalDeadline: {
            type: Date,
            index: true
        },

        /*
         * Indicates that the outreach needs human follow-up.
         */
        manualFollowUpRequired: {
            type: Boolean,
            default: false,
            index: true
        },

        manualFollowUpReason: {
            type: String,
            trim: true
        },

        /*
         * Prevents the same patient/campaign outreach
         * from accidentally being created twice.
         */
        idempotencyKey: {
            type: String,
            unique: true,
            sparse: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Outreach", outreachSchema);