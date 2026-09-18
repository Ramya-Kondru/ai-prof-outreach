import { useState } from "react";
import api from "../../services/api";
import "./CreateCampaign.css";

function CreateCampaign({ onClose }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minimumDays, setMinimumDays] = useState("");
    const [maximumDays, setMaximumDays] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const campaign = {
            name,
            description,
            startDate,
            endDate,
            followUpWindow: {
                minimumDaysAfterDischarge: Number(minimumDays),
                maximumDaysAfterDischarge: Number(maximumDays),
            },
        };

        try {
            const response = await api.post(
                "/campaigns",
                campaign
            );

            console.log(
                "Campaign created:",
                response.data
            );

            alert("Campaign created successfully!");

            onClose();
        } catch (error) {
            console.error(
                "Error creating campaign:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create campaign"
            );
        }
    };

    return (
        <div className="campaign-modal-overlay">
            <div className="campaign-modal">

                <div className="modal-header">
                    <div>
                        <h2>Create Campaign</h2>

                        <p>
                            Create a new patient outreach campaign.
                        </p>
                    </div>

                    <button
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Campaign Name */}

                    <div className="form-group">
                        <label>Campaign Name</label>

                        <input
                            type="text"
                            placeholder="e.g. Diabetes Follow-up"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />
                    </div>


                    {/* Description */}

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            placeholder="Describe the purpose of this campaign"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            required
                        />
                    </div>


                    {/* Start Date */}

                    <div className="form-group">
                        <label>Start Date</label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            required
                        />
                    </div>


                    {/* End Date */}

                    <div className="form-group">
                        <label>End Date</label>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            required
                        />
                    </div>


                    {/* Follow-up Window */}

                    <div className="age-fields">

                        <div className="form-group">
                            <label>
                                Minimum Days After Discharge
                            </label>

                            <input
                                type="number"
                                placeholder="0"
                                value={minimumDays}
                                onChange={(e) =>
                                    setMinimumDays(
                                        e.target.value
                                    )
                                }
                                min="0"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>
                                Maximum Days After Discharge
                            </label>

                            <input
                                type="number"
                                placeholder="30"
                                value={maximumDays}
                                onChange={(e) =>
                                    setMaximumDays(
                                        e.target.value
                                    )
                                }
                                min="0"
                                required
                            />
                        </div>

                    </div>


                    {/* Buttons */}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-button"
                        >
                            Create Campaign
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default CreateCampaign;