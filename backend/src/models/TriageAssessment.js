const mongoose = require("mongoose");

const triageAssessmentSchema = new mongoose.Schema(
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

        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true
        },

        outreachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Outreach",
            required: true,
            index: true
        },

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

        symptoms: [
            {
                type: String,
                trim: true
            }
        ],

        redFlags: [
            {
                type: String,
                trim: true
            }
        ],

        reasoning: {
            type: String,
            required: true,
            trim: true
        },

        recommendedAction: {
            type: String,
            required: true,
            trim: true
        },

        requiresHumanReview: {
            type: Boolean,
            default: false,
            index: true
        },

        source: {
            type: String,
            default: "RULE_BASED_DEMO"
        }
    },
    {
        timestamps: true
    }
);

const TriageAssessment =
    mongoose.model(
        "TriageAssessment",
        triageAssessmentSchema
    );

module.exports = TriageAssessment;