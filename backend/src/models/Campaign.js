const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
    {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "ACTIVE",
                "PAUSED",
                "COMPLETED"
            ],
            default: "DRAFT"
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        followUpWindow: {
            minimumDaysAfterDischarge: {
                type: Number,
                required: true,
                min: 0
            },

            maximumDaysAfterDischarge: {
                type: Number,
                required: true,
                min: 0
            }
        },

        priority: {
            type: Number,
            default: 5,
            min: 1,
            max: 10
        },

        callingHours: {
            start: {
                type: String,
                required: true,
                default: "09:00"
            },

            end: {
                type: String,
                required: true,
                default: "18:00"
            }
        },

        outboundCapacity: {
            type: Number,
            required: true,
            default: 5,
            min: 1
        },

        retryPolicy: {
            maxAttempts: {
                type: Number,
                default: 3,
                min: 1
            },

            backoffMinutes: {
                type: Number,
                default: 15,
                min: 1
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Campaign", campaignSchema);