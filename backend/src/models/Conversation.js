const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
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

        outreachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Outreach",
            required: true,
            index: true
        },

        messages: [
            {
                sender: {
                    type: String,
                    enum: [
                        "PATIENT",
                        "HOSPITAL",
                        "AI"
                    ],
                    required: true
                },

                message: {
                    type: String,
                    required: true,
                    trim: true
                },

                sentAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        status: {
            type: String,
            enum: [
                "OPEN",
                "RESOLVED"
            ],
            default: "OPEN",
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Conversation",
        conversationSchema
    );