import { useState } from "react";
import api from "../../services/api";

function AITest() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const testAI = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await api.post(
                "/ai/generate-message",
                {
                    campaignName: "Heart Disease Follow up",
                    campaignPurpose:
                        "Follow up with patients after discharge",
                    outcome: "NO_ANSWER",
                    followUpContext:
                        "Patient needs another follow-up call"
                }
            );

            console.log(
                "AI response:",
                response.data
            );

            setMessage(
                response.data.generatedMessage
            );

        } catch (error) {

            console.error(
                "AI test error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "AI request failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>AI Test</h1>

            <p>
                Test AI-generated outreach messages.
            </p>

            <button
                onClick={testAI}
                disabled={loading}
            >
                {loading
                    ? "Generating..."
                    : "Generate AI Message"}
            </button>

            {message && (
                <div
                    style={{
                        marginTop: "25px",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        background: "#fff"
                    }}
                >
                    <h3>
                        Generated Message
                    </h3>

                    <p>
                        {message}
                    </p>
                </div>
            )}

        </div>
    );
}

export default AITest;