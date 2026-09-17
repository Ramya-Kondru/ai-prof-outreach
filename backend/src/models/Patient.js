const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
            index: true
        },

        patientId: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date
        },

        dischargeDate: {
            type: Date,
            required: true
        },

        dischargeDisposition: {
            type: String,
            enum: [
                "HOME",
                "TRANSFERRED",
                "SKILLED_NURSING",
                "OTHER"
            ],
            default: "HOME"
        },

        followUpRequired: {
            type: Boolean,
            default: true
        },

        communicationEligible: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

patientSchema.index(
    { hospitalId: 1, patientId: 1 },
    { unique: true }
);

module.exports = mongoose.model("Patient", patientSchema);