const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        contactEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        contactPhone: {
            type: String,
            trim: true
        },

        timezone: {
            type: String,
            required: true,
            default: "Asia/Kolkata"
        },

        callingHours: {
            start: {
                type: String,
                default: "09:00"
            },
            end: {
                type: String,
                default: "18:00"
            }
        },

        outboundCapacity: {
            type: Number,
            required: true,
            default: 5,
            min: 1
        },

        status: {
            type: String,
            enum: ["CONFIGURING", "READY", "INACTIVE"],
            default: "CONFIGURING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Hospital", hospitalSchema);