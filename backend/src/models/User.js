const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "PLATFORM_ADMIN",
                "HOSPITAL_ADMIN",
                "CAMPAIGN_MANAGER",
                "CLINICAL_REVIEWER"
            ],
            required: true
        },

        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);