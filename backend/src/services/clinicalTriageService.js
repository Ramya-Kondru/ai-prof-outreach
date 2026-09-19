const Escalation = require("../models/Escalation");
const Observation = require("../models/Observation");
const FollowUp = require("../models/FollowUp");

// ======================================================
// CLINICAL TRIAGE
// ======================================================

const performClinicalTriage = async ({
    hospitalId,
    patientId,
    outreachId,
    conversationId,
    patientMessage
}) => {

    const message =
        patientMessage.toLowerCase().trim();


    // ==================================================
    // URGENT / HIGH-RISK SYMPTOMS
    // ==================================================

    const urgentKeywords = [
        "chest pain",
        "difficulty breathing",
        "can't breathe",
        "cannot breathe",
        "severe bleeding",
        "unconscious",
        "fainted",
        "fainting",
        "stroke",
        "seizure",
        "severe pain",
        "suicidal",
        "suicide"
    ];


    const highRiskKeywords = [
        "shortness of breath",
        "high fever",
        "persistent vomiting",
        "severe dizziness",
        "confusion",
        "blood pressure is very high",
        "blood pressure very high"
    ];


    // ==================================================
    // FOLLOW-UP INDICATORS
    // ==================================================

    const followUpKeywords = [
        "appointment",
        "doctor",
        "follow up",
        "follow-up",
        "checkup",
        "check-up",
        "medication",
        "medicine",
        "side effect",
        "symptoms",
        "pain",
        "fever",
        "dizziness",
        "headache",
        "not feeling well"
    ];


    // ==================================================
    // DEFAULT TRIAGE VALUES
    // ==================================================

    let triageResult =
        "NORMAL";

    let urgency =
        "LOW";

    let reason =
        "No immediate clinical concern identified from the patient's message.";

    let trigger =
        "CLINICAL_TRIAGE";

    let requiresHumanReview =
        false;


    // ==================================================
    // URGENT TRIAGE
    // ==================================================

    const hasUrgentSymptom =
        urgentKeywords.some(
            keyword =>
                message.includes(keyword)
        );


    if (hasUrgentSymptom) {

        triageResult =
            "ESCALATION_REQUIRED";

        urgency =
            "URGENT";

        requiresHumanReview =
            true;

        reason =
            "Patient message contains a potentially urgent clinical symptom.";

    }


    // ==================================================
    // HIGH-RISK TRIAGE
    // ==================================================

    else {

        const hasHighRiskSymptom =
            highRiskKeywords.some(
                keyword =>
                    message.includes(keyword)
            );


        if (hasHighRiskSymptom) {

            triageResult =
                "ESCALATION_REQUIRED";

            urgency =
                "HIGH";

            requiresHumanReview =
                true;

            reason =
                "Patient message contains a potentially high-risk clinical symptom.";

        }


        // ==================================================
        // FOLLOW-UP TRIAGE
        // ==================================================

        else {

            const needsFollowUp =
                followUpKeywords.some(
                    keyword =>
                        message.includes(keyword)
                );


            if (needsFollowUp) {

                triageResult =
                    "FOLLOW_UP_REQUIRED";

                urgency =
                    "MEDIUM";

                reason =
                    "Patient message indicates that clinical follow-up may be required.";

            }

        }

    }


    // ==================================================
    // DOCUMENT PATIENT MESSAGE
    // ==================================================

    await Observation.create({

        hospitalId,

        patientId,

        outreachId,

        conversationId,

        type:
            "PATIENT_REPORTED",

        name:
            "Patient Message",

        value:
            patientMessage,

        status:
            "UNKNOWN",

        source:
            "PATIENT",

        observedAt:
            new Date()

    });


    // ==================================================
    // DOCUMENT CLINICAL TRIAGE RESULT
    // ==================================================

    const triageObservation =
        await Observation.create({

            hospitalId,

            patientId,

            outreachId,

            conversationId,

            type:
                "AI_ASSESSMENT",

            name:
                "Clinical Triage",

            value:
                triageResult,

            status:
                triageResult === "NORMAL"
                    ? "NORMAL"
                    : "ABNORMAL",

            source:
                "AI",

            observedAt:
                new Date()

        });


    console.log(
        "Clinical triage observation created:",
        triageObservation._id
    );


    // ==================================================
    // ESCALATION
    // ==================================================

    let escalation =
        null;


    if (
        triageResult ===
        "ESCALATION_REQUIRED"
    ) {

        escalation =
            await Escalation.create({

                hospitalId,

                patientId,

                outreachId,

                conversationId,

                urgency,

                reason,

                trigger,

                requiresHumanReview,

                status:
                    "OPEN"

            });


        console.log(
            "Escalation created:",
            escalation._id
        );

    }


    // ==================================================
    // FOLLOW-UP
    // ==================================================

    let followUp =
        null;


    if (
        triageResult ===
        "FOLLOW_UP_REQUIRED"
    ) {

        followUp =
            await FollowUp.create({

                hospitalId,

                patientId,

                outreachId,

                conversationId,

                type:
                    "GENERAL",

                reason,

                status:
                    "PENDING"

            });


        console.log(
            "Follow-up created:",
            followUp._id
        );

    }


    // ==================================================
    // RETURN TRIAGE RESULT
    // ==================================================

    return {

        triageResult,

        urgency,

        reason,

        requiresHumanReview,

        triageObservation,

        escalation,

        followUp

    };

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    performClinicalTriage
};