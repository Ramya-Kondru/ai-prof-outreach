import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./RecentCampaigns.css";

function RecentCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [eligibleCounts, setEligibleCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get("/campaigns");

                const campaignData =
                    response.data.campaigns || [];

                setCampaigns(campaignData);

                const counts = {};

                await Promise.all(
                    campaignData.map(async (campaign) => {
                        try {
                            const result = await api.get(
                                `/campaigns/${campaign._id}/eligible-patients`
                            );

                            counts[campaign._id] =
                                result.data.count;

                        } catch (error) {
                            console.error(
                                `Error fetching eligible patients for ${campaign.name}:`,
                                error
                            );

                            counts[campaign._id] = 0;
                        }
                    })
                );

                setEligibleCounts(counts);

            } catch (error) {
                console.error(
                    "Error fetching campaigns:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="campaign-section">

            <div className="section-header">
                <h2>Recent Campaigns</h2>

                <button onClick={() => navigate("/campaigns")}>
                    View All
                </button>
            </div>

            <div className="campaign-table">

                <div className="campaign-row campaign-heading">
                    <span>Campaign</span>
                    <span>Status</span>
                    <span>Patients</span>
                </div>

                {loading ? (
                    <p>Loading campaigns...</p>
                ) : campaigns.length === 0 ? (
                    <p>No campaigns found.</p>
                ) : (
                    campaigns.slice(0, 5).map((campaign) => (
                        <div
                            className="campaign-row"
                            key={campaign._id}
                        >
                            <span>
                                {campaign.name}
                            </span>

                            <span
                                className={`campaign-status ${campaign.status.toLowerCase()}`}
                            >
                                {campaign.status}
                            </span>

                            <span>
                                {eligibleCounts[campaign._id] ??
                                    "..."}
                            </span>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}

export default RecentCampaigns;