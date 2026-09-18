import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Eligibility.css";

function Eligibility() {
  const [patients, setPatients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creatingOutreach, setCreatingOutreach] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, campaignsResponse] =
          await Promise.all([
            api.get("/patients"),
            api.get("/campaigns"),
          ]);

        setPatients(
          patientsResponse.data.patients || []
        );

        setCampaigns(
          campaignsResponse.data.campaigns || []
        );
      } catch (error) {
        console.error(
          "Error fetching eligibility data:",
          error
        );
      }
    };

    fetchData();
  }, []);

  const handleCheckEligibility = async (e) => {
    e.preventDefault();

    if (!selectedPatient || !selectedCampaign) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.get(
        `/patients/${selectedPatient}/eligibility/${selectedCampaign}`
      );

      console.log(
        "Eligibility result:",
        response.data
      );

      setResult(response.data);

    } catch (error) {
      console.error(
        "Eligibility check error:",
        error
      );

      setResult({
        eligible: false,
        reason:
          error.response?.data?.message ||
          "Unable to check eligibility",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOutreach = async () => {
    if (!selectedPatient || !selectedCampaign) {
      return;
    }

    setCreatingOutreach(true);

    try {
      const response = await api.post("/outreach", {
        patientId: selectedPatient,
        campaignId: selectedCampaign,
      });

      console.log(
        "Outreach created:",
        response.data
      );

      alert("Outreach queued successfully!");

    } catch (error) {
      console.error(
        "Create outreach error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to create outreach"
      );
    } finally {
      setCreatingOutreach(false);
    }
  };

  return (
    <div className="eligibility-page">

      <div className="page-header">
        <div>
          <h1>Eligibility</h1>

          <p>
            Check whether a patient is eligible for
            a campaign.
          </p>
        </div>
      </div>

      <div className="eligibility-card">

        <form onSubmit={handleCheckEligibility}>

          <div className="form-group">
            <label>Patient</label>

            <select
              value={selectedPatient}
              onChange={(e) => {
                setSelectedPatient(e.target.value);
                setResult(null);
              }}
              required
            >
              <option value="">
                Select patient
              </option>

              {patients.map((patient) => (
                <option
                  key={patient._id}
                  value={patient._id}
                >
                  {patient.name} ({patient.patientId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Campaign</label>

            <select
              value={selectedCampaign}
              onChange={(e) => {
                setSelectedCampaign(e.target.value);
                setResult(null);
              }}
              required
            >
              <option value="">
                Select campaign
              </option>

              {campaigns.map((campaign) => (
                <option
                  key={campaign._id}
                  value={campaign._id}
                >
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="check-eligibility-button"
            disabled={loading}
          >
            {loading
              ? "Checking..."
              : "Check Eligibility"}
          </button>

        </form>

        {result && (
          <div
            className={`eligibility-result ${
              result.eligible
                ? "result-eligible"
                : "result-ineligible"
            }`}
          >

            <h2>
              {result.eligible
                ? "ELIGIBLE"
                : "INELIGIBLE"}
            </h2>

            <p>
              {result.reason ||
                (result.eligible
                  ? "Patient is eligible for this campaign."
                  : "Patient is not eligible for this campaign.")}
            </p>

            {result.eligible && (
              <button
                className="create-outreach-button"
                onClick={handleCreateOutreach}
                disabled={creatingOutreach}
              >
                {creatingOutreach
                  ? "Creating Outreach..."
                  : "Create Outreach"}
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default Eligibility;