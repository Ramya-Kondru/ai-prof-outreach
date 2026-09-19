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
    // CHECK IF THIS MESSAGE WAS ALREADY TRIAGED
    // ==================================================
    //
    // This prevents duplicate documentation when the same
    // patient message triggers triage more than once.
    //
    // ==================================================

    const existingTriageObservation =
        await Observation.findOne({

            hospitalId,

            patientId,

            conversationId,

            type:
                "AI_ASSESSMENT",

            name:
                "Clinical Triage",

            source:
                "AI",

            value: {
                $in: [
                    "NORMAL",
                    "FOLLOW_UP_REQUIRED",
                    "ESCALATION_REQUIRED"
                ]
            }

        })
            .sort({
                createdAt: -1
            });


    if (existingTriageObservation) {

        // Find the patient-message observation that belongs
        // to the same triage execution.

        const existingPatientObservation =
            await Observation.findOne({

                hospitalId,

                patientId,

                conversationId,

                type:
                    "PATIENT_REPORTED",

                name:
                    "Patient Message",

                value:
                    patientMessage

            })
                .sort({
                    createdAt: -1
                });


        // --------------------------------------------------
        // Existing escalation created by this triage
        // --------------------------------------------------

        let existingEscalation = null;

        if (
            existingTriageObservation.value ===
            "ESCALATION_REQUIRED"
        ) {

            existingEscalation =
                await Escalation.findOne({

                    hospitalId,

                    patientId,

                    conversationId,

                    createdAt: {
                        $gte:
                            existingTriageObservation.createdAt
                    }

                })
                    .sort({
                        createdAt: -1
                    });

        }


        // --------------------------------------------------
        // Existing follow-up created by this triage
        // --------------------------------------------------

        let existingFollowUp = null;

        if (
            existingTriageObservation.value ===
            "FOLLOW_UP_REQUIRED"
        ) {

            existingFollowUp =
                await FollowUp.findOne({

                    hospitalId,

                    patientId,

                    conversationId,

                    createdAt: {
                        $gte:
                            existingTriageObservation.createdAt
                    }

                })
                    .sort({
                        createdAt: -1
                    });

        }


        // --------------------------------------------------
        // Return existing result instead of creating
        // duplicate clinical records.
        // --------------------------------------------------

        let urgency =
            "LOW";

        let reason =
            "No immediate clinical concern identified from the patient's message.";

        let requiresHumanReview =
            false;


        if (
            existingTriageObservation.value ===
            "ESCALATION_REQUIRED"
        ) {

            urgency =
                existingEscalation?.urgency ||
                "URGENT";

            reason =
                existingEscalation?.reason ||
                "Patient message contains a potentially urgent clinical symptom.";

            requiresHumanReview =
                true;

        }


        else if (
            existingTriageObservation.value ===
            "FOLLOW_UP_REQUIRED"
        ) {

            urgency =
                "MEDIUM";

            reason =
                existingFollowUp?.reason ||
                "Patient message indicates that clinical follow-up may be required.";

        }


        return {

            triageResult:
                existingTriageObservation.value,

            urgency,

            reason,

            requiresHumanReview,

            triageObservation:
                existingTriageObservation,

            patientObservation:
                existingPatientObservation,

            escalation:
                existingEscalation,

            followUp:
                existingFollowUp,

            alreadyTriaged:
                true

        };

    }


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

    const patientObservation =
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


    console.log(
        "Patient message observation created:",
        patientObservation._id
    );


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

        patientObservation,

        escalation,

        followUp,

        alreadyTriaged:
            false

    };

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    performClinicalTriage
};