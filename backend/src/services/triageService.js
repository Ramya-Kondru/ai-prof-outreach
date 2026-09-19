// ======================================================
// CLINICAL TRIAGE SERVICE
// ======================================================
//
// Demonstration-only triage logic.
// This does NOT diagnose medical conditions.
//
// The purpose is to demonstrate:
// Conversation
//      ↓
// Structured assessment
//      ↓
// Urgency
//      ↓
// Human review
//
// ======================================================


const analyzeConversationForTriage = (
    conversation
) => {

    // --------------------------------------------------
    // Combine all conversation messages
    // --------------------------------------------------

    const conversationText =
        conversation.messages
            .map((msg) => msg.message)
            .join(" ")
            .toLowerCase();


    // --------------------------------------------------
    // Keywords used for demonstration
    // --------------------------------------------------

    const urgentKeywords = [
        "chest pain",
        "difficulty breathing",
        "can't breathe",
        "cannot breathe",
        "severe bleeding",
        "unconscious",
        "passed out",
        "fainted",
        "stroke",
        "seizure"
    ];


    const highRiskKeywords = [
        "severe pain",
        "high fever",
        "persistent vomiting",
        "dizziness",
        "shortness of breath",
        "blood pressure is very high"
    ];


    const symptomKeywords = [
        "pain",
        "fever",
        "cough",
        "vomiting",
        "nausea",
        "dizziness",
        "headache",
        "breathing",
        "bleeding",
        "fatigue",
        "weakness"
    ];


    // --------------------------------------------------
    // Detect urgent red flags
    // --------------------------------------------------

    const detectedUrgent =
        urgentKeywords.filter((keyword) =>
            conversationText.includes(keyword)
        );


    // --------------------------------------------------
    // Detect high-risk indicators
    // --------------------------------------------------

    const detectedHighRisk =
        highRiskKeywords.filter((keyword) =>
            conversationText.includes(keyword)
        );


    // --------------------------------------------------
    // Detect symptoms
    // --------------------------------------------------

    const detectedSymptoms =
        symptomKeywords.filter((keyword) =>
            conversationText.includes(keyword)
        );


    // --------------------------------------------------
    // Determine urgency
    // --------------------------------------------------

    let urgency = "LOW";

    let requiresHumanReview = false;

    let reasoning =
        "No high-risk indicators were detected in the conversation.";

    let recommendedAction =
        "Continue routine follow-up according to the campaign.";


    // ==================================================
    // URGENT
    // ==================================================

    if (detectedUrgent.length > 0) {

        urgency = "URGENT";

        requiresHumanReview = true;

        reasoning =
            `Potential urgent warning indicators detected: ${detectedUrgent.join(", ")}.`;

        recommendedAction =
            "Escalate immediately for human clinical review. If the situation appears to be an emergency, follow the hospital's emergency protocol.";

    }


    // ==================================================
    // HIGH
    // ==================================================

    else if (detectedHighRisk.length > 0) {

        urgency = "HIGH";

        requiresHumanReview = true;

        reasoning =
            `Potential high-risk symptoms detected: ${detectedHighRisk.join(", ")}.`;

        recommendedAction =
            "Escalate for human clinical review before continuing automated outreach.";

    }


    // ==================================================
    // MEDIUM
    // ==================================================

    else if (detectedSymptoms.length > 0) {

        urgency = "MEDIUM";

        reasoning =
            `Symptoms or health-related concerns detected: ${detectedSymptoms.join(", ")}.`;

        recommendedAction =
            "Continue conversation and collect additional information. Consider human review if symptoms persist or worsen.";

    }


    // ==================================================
    // LOW
    // ==================================================

    else {

        urgency = "LOW";

        reasoning =
            "The conversation does not contain detected high-risk indicators.";

        recommendedAction =
            "Continue routine outreach and monitor for new symptoms or concerns.";

    }


    // --------------------------------------------------
    // Return structured result
    // --------------------------------------------------

    return {

        urgency,

        symptoms:
            detectedSymptoms,

        redFlags:
            detectedUrgent,

        reasoning,

        recommendedAction,

        requiresHumanReview

    };

};


module.exports = {
    analyzeConversationForTriage
};