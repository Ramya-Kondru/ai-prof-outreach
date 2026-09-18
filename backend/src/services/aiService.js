const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ======================================================
// GENERATE OUTREACH MESSAGE
// ======================================================

const generateOutreachMessage = async ({
    campaignName,
    campaignPurpose,
    outcome,
    followUpContext
}) => {

    try {

        const prompt = `
You are an AI assistant for a hospital patient outreach management system.

Generate a professional, polite, and concise patient outreach message.

Campaign:
${campaignName || "Patient Follow-up"}

Campaign purpose:
${campaignPurpose || "General patient follow-up"}

Previous outreach outcome:
${outcome || "No previous outcome"}

Follow-up context:
${followUpContext || "Routine follow-up"}

Requirements:
- Be professional and empathetic.
- Keep the message short.
- Do not provide medical diagnosis or medical advice.
- Do not invent patient information.
- Do not mention internal hospital systems.
- Do not mention AI.
- Do not use placeholders for information that was not provided.
- The message should be suitable for SMS or WhatsApp.
- Return only the message itself.
`;


        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            input: prompt

        });


        const message =
            response.output_text?.trim();


        if (!message) {

            throw new Error(
                "AI returned an empty message"
            );
        }


        return message;

    } catch (error) {

        console.error(
            "AI message generation error:",
            error.message
        );

        throw new Error(
            "Failed to generate outreach message"
        );
    }
};

// ======================================================
// GENERATE CONVERSATION REPLY
// ======================================================

const generateConversationReply = async ({
    campaignName,
    conversationHistory,
    patientMessage
}) => {

    try {

        const prompt = `
You are an AI assistant for a hospital patient outreach management system.

Generate a professional, polite, concise response to a patient's message.

Campaign:
${campaignName || "Patient Follow-up"}

Conversation history:
${conversationHistory || "No previous conversation"}

Latest patient message:
${patientMessage}

Requirements:
- Be professional and empathetic.
- Keep the response short.
- Do not provide medical diagnosis.
- Do not provide medical advice.
- Do not invent patient information.
- Do not claim to be a doctor.
- Do not mention internal hospital systems.
- Do not mention AI.
- If the patient asks a medical question, advise them to contact their care team rather than answering medically.
- Return only the response message.
`;

        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            input: prompt

        });

        const message =
            response.output_text?.trim();

        if (!message) {

            throw new Error(
                "AI returned an empty response"
            );
        }

        return message;

    } catch (error) {

        console.error(
            "AI conversation reply error:",
            error.message
        );

        throw new Error(
            "Failed to generate conversation reply"
        );
    }
};


module.exports = {
    generateOutreachMessage,
    generateConversationReply
};