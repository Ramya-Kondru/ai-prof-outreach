import { useEffect, useState } from "react";
import api from "../services/api";
import "./SummaryCards.css";

function SummaryCards() {
    const [stats, setStats] = useState({
        activeCampaigns: 0,
        totalPatients: 0,
        queuedOutreach: 0,
        completedOutreach: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/dashboard/stats");

                console.log("Dashboard stats:", response.data);

                setStats(response.data);

            } catch (error) {
                console.error(
                    "Error fetching dashboard stats:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: "Active Campaigns",
            value: stats.activeCampaigns,
            description: "Currently running",
        },
        {
            title: "Total Patients",
            value: stats.totalPatients,
            description: "Patients in the system",
        },
        {
            title: "Queued Outreach",
            value: stats.queuedOutreach,
            description: "Waiting to be processed",
        },
        {
            title: "Completed Outreach",
            value: stats.completedOutreach,
            description: "Successfully completed",
        },
    ];

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="summary-cards">
            {cards.map((card) => (
                <div
                    className="summary-card"
                    key={card.title}
                >
                    <p className="summary-card-title">
                        {card.title}
                    </p>

                    <h2 className="summary-card-value">
                        {card.value}
                    </h2>

                    <p className="summary-card-description">
                        {card.description}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;