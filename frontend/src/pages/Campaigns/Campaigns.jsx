import { useState, useEffect } from "react";
import CreateCampaign from "./CreateCampaign";
import api from "../../services/api";
import "./Campaigns.css";

function Campaigns() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [eligibleCounts, setEligibleCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);

            const response = await api.get("/campaigns");

            const campaignData = response.data.campaigns || [];

            setCampaigns(campaignData);

            const counts = {};

            await Promise.all(
                campaignData.map(async (campaign) => {
                    try {
                        const result = await api.get(
                            `/campaigns/${campaign._id}/eligible-patients`
                        );

                        counts[campaign._id] = result.data.count;
                    } catch (error) {
                        console.error(
                            `Error fetching eligible count for ${campaign.name}:`,
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


    const handleActivate = async (campaignId) => {
        try {
            const response = await api.patch(
                `/campaigns/${campaignId}`,
                {
                    status: "ACTIVE",
                }
            );

            console.log(
                "Campaign activated:",
                response.data
            );

            alert("Campaign activated successfully!");

            fetchCampaigns();

        } catch (error) {
            console.error(
                "Error activating campaign:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to activate campaign"
            );
        }
    };


    useEffect(() => {
        fetchCampaigns();
    }, []);


    return (
        <div className="campaigns-page">

            <div className="page-header">

                <div>
                    <h1>Campaigns</h1>

                    <p>
                        Create and manage patient outreach campaigns.
                    </p>
                </div>

                <button
                    className="create-campaign-button"
                    onClick={() => setShowCreateForm(true)}
                >
                    + Create Campaign
                </button>

            </div>


            <div className="campaigns-grid">

                {loading ? (
                    <p>Loading campaigns...</p>

                ) : campaigns.length === 0 ? (
                    <p>No campaigns found.</p>

                ) : (
                    campaigns.map((campaign) => (

                        <div
                            className="campaign-card"
                            key={campaign._id}
                        >

                            <div className="campaign-card-header">

                                <h2>
                                    {campaign.name}
                                </h2>

                                <span
                                    className={`campaign-status ${campaign.status.toLowerCase()}`}
                                >
                                    {campaign.status}
                                </span>

                            </div>


                            <p className="campaign-description">
                                {campaign.description || "No description provided."}
                            </p>


                            <div className="campaign-info">

                                <span>
                                    Eligible Patients
                                </span>

                                <strong>
                                    {eligibleCounts[campaign._id] ?? 0}
                                </strong>

                            </div>


                            <div className="campaign-actions">

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        setSelectedCampaign(campaign)
                                    }
                                >
                                    View
                                </button>


                                {campaign.status === "DRAFT" && (
                                    <button
                                        className="activate-button"
                                        onClick={() =>
                                            handleActivate(campaign._id)
                                        }
                                    >
                                        Activate
                                    </button>
                                )}

                            </div>

                        </div>

                    ))
                )}

            </div>


            {/* Create Campaign Modal */}

            {showCreateForm && (
                <CreateCampaign
                    onClose={() => {
                        setShowCreateForm(false);
                        fetchCampaigns();
                    }}
                />
            )}


            {/* View Campaign Modal */}

            {selectedCampaign && (

                <div className="view-modal-overlay">

                    <div className="view-modal">

                        <div className="view-modal-header">

                            <div>

                                <h2>
                                    {selectedCampaign.name}
                                </h2>

                                <p>
                                    Campaign Details
                                </p>

                            </div>

                            <button
                                className="view-close-button"
                                onClick={() =>
                                    setSelectedCampaign(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                Status
                            </span>

                            <span
                                className={`campaign-status ${selectedCampaign.status.toLowerCase()}`}
                            >
                                {selectedCampaign.status}
                            </span>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                Eligible Patients
                            </span>

                            <span className="campaign-detail-value">
                                {eligibleCounts[selectedCampaign._id] ?? 0}
                            </span>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                Description
                            </span>

                            <span className="campaign-detail-value">
                                {selectedCampaign.description || "-"}
                            </span>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                Start Date
                            </span>

                            <span className="campaign-detail-value">
                                {new Date(
                                    selectedCampaign.startDate
                                ).toLocaleDateString()}
                            </span>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                End Date
                            </span>

                            <span className="campaign-detail-value">
                                {new Date(
                                    selectedCampaign.endDate
                                ).toLocaleDateString()}
                            </span>

                        </div>


                        <div className="follow-up-section">

                            <h3>
                                Follow-up Window
                            </h3>

                            <div className="follow-up-window">

                                <div className="follow-up-item">

                                    <span>
                                        Minimum
                                    </span>

                                    <strong>
                                        {
                                            selectedCampaign
                                                .followUpWindow
                                                ?.minimumDaysAfterDischarge
                                        }{" "}
                                        days
                                    </strong>

                                </div>


                                <div className="follow-up-item">

                                    <span>
                                        Maximum
                                    </span>

                                    <strong>
                                        {
                                            selectedCampaign
                                                .followUpWindow
                                                ?.maximumDaysAfterDischarge
                                        }{" "}
                                        days
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                Priority
                            </span>

                            <span className="campaign-detail-value">
                                {selectedCampaign.priority}
                            </span>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                Calling Hours
                            </span>

                            <span className="campaign-detail-value">
                                {
                                    selectedCampaign.callingHours
                                        ?.start
                                }{" "}
                                -{" "}
                                {
                                    selectedCampaign.callingHours
                                        ?.end
                                }
                            </span>

                        </div>


                        <div className="campaign-detail">

                            <span className="campaign-detail-label">
                                Outbound Capacity
                            </span>

                            <span className="campaign-detail-value">
                                {selectedCampaign.outboundCapacity}
                            </span>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Campaigns;