import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Queue.css";

function Queue() {
    const [outreach, setOutreach] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const fetchOutreach = async () => {
        try {
            const response = await api.get("/outreach");

            setOutreach(response.data.outreach || []);
        } catch (error) {
            console.error(
                "Error fetching outreach:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutreach();
    }, []);

    const handleProcessQueue = async () => {
        setProcessing(true);
        setResult(null);

        try {
            const response = await api.post("/queue/process");

            console.log(
                "Queue processed:",
                response.data
            );

            setResult(response.data);

            alert(
                `Queue processed successfully! ${response.data.count} outreach record(s) processed.`
            );

            await fetchOutreach();

        } catch (error) {
            console.error(
                "Queue processing error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to process queue"
            );
        } finally {
            setProcessing(false);
        }
    };

    const queuedCount = outreach.filter(
        (item) => item.status === "QUEUED"
    ).length;

    const inProgressCount = outreach.filter(
        (item) => item.status === "IN_PROGRESS"
    ).length;

    const completedCount = outreach.filter(
        (item) => item.status === "COMPLETED"
    ).length;

    const failedCount = outreach.filter(
        (item) => item.status === "FAILED"
    ).length;

    const cancelledCount = outreach.filter(
        (item) => item.status === "CANCELLED"
    ).length;
    const manualFollowUpCount = outreach.filter(
        (item) => item.status === "MANUAL_FOLLOW_UP"
    ).length;

    return (
        <div className="queue-page">

            <div className="page-header">

                <div>
                    <h1>Queue</h1>

                    <p>
                        Process queued patient outreach activities.
                    </p>
                </div>

                <button
                    className="process-queue-button"
                    onClick={handleProcessQueue}
                    disabled={processing}
                >
                    {processing
                        ? "Processing..."
                        : "Process Queue"}
                </button>

            </div>


            {loading ? (
                <div className="queue-card">
                    <p>Loading queue...</p>
                </div>
            ) : (
                <>
                    <div className="queue-stats">

                        <div className="queue-stat-card">
                            <span>Queued</span>
                            <strong>{queuedCount}</strong>
                        </div>

                        <div className="queue-stat-card">
                            <span>In Progress</span>
                            <strong>{inProgressCount}</strong>
                        </div>

                        <div className="queue-stat-card">
                            <span>Completed</span>
                            <strong>{completedCount}</strong>
                        </div>

                        <div className="queue-stat-card">
                            <span>Failed</span>
                            <strong>{failedCount}</strong>
                        </div>

                        <div className="queue-stat-card">
                            <span>Cancelled</span>
                            <strong>{cancelledCount}</strong>
                        </div>
                        <div className="queue-stat-card">
                            <span>Manual Follow-up</span>
                            <strong>{manualFollowUpCount}</strong>
                        </div>

                    </div>


                    <div className="queue-card">

                        {!result ? (
                            <div className="queue-empty">

                                <h2>Outreach Queue</h2>

                                <p>
                                    {queuedCount === 0
                                        ? "There are no queued outreach activities."
                                        : `${queuedCount} outreach record(s) are waiting to be processed.`}
                                </p>

                            </div>
                        ) : (
                            <div className="queue-result">

                                <h2>Queue Processed</h2>

                                <p>
                                    {result.count} outreach
                                    record(s) processed
                                    successfully.
                                </p>

                            </div>
                        )}

                    </div>
                </>
            )}

        </div>
    );
}

export default Queue;