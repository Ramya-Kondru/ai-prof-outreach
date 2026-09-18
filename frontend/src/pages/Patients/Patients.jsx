import { useEffect, useState } from "react";
import AddPatient from "./AddPatient";
import api from "../../services/api";
import "./Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");

      console.log("PATIENTS:", response.data);

      setPatients(response.data.patients || []);
    } catch (error) {
      console.error(
        "Error fetching patients:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="patients-page">

      <div className="page-header">

        <div>
          <h1>Patients</h1>

          <p>
            View and manage patient information.
          </p>
        </div>

        <button
          className="add-patient-button"
          onClick={() => setShowAddForm(true)}
        >
          + Add Patient
        </button>

      </div>


      <div className="patients-card">

        {loading ? (
          <p>Loading patients...</p>
        ) : patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (

          <div className="patients-table">

            <div className="patient-row patient-heading">
              <span>Name</span>
              <span>Patient ID</span>
              <span>Discharge Date</span>
              <span>Communication</span>
              <span>Action</span>
            </div>


            {patients.map((patient) => (

              <div
                className="patient-row"
                key={patient._id}
              >

                <span>
                  {patient.name}
                </span>

                <span>
                  {patient.patientId}
                </span>

                <span>
                  {patient.dischargeDate
                    ? new Date(
                        patient.dischargeDate
                      ).toLocaleDateString()
                    : "-"}
                </span>

                <span>
                  <span
                    className={`patient-status ${
                      patient.communicationEligible
                        ? "eligible"
                        : "ineligible"
                    }`}
                  >
                    {patient.communicationEligible
                      ? "ELIGIBLE"
                      : "INELIGIBLE"}
                  </span>
                </span>

                <button
                  className="view-button"
                  onClick={() =>
                    setSelectedPatient(patient)
                  }
                >
                  View
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {showAddForm && (
        <AddPatient
          onClose={() => setShowAddForm(false)}
          onPatientAdded={fetchPatients}
        />
      )}


      {selectedPatient && (
        <div className="patient-modal-overlay">

          <div className="patient-details-modal">

            <div className="modal-header">

              <div>
                <h2>Patient Details</h2>

                <p>
                  Patient information
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setSelectedPatient(null)
                }
              >
                ×
              </button>

            </div>


            <div className="patient-details">

              <div className="detail-item">
                <span>Patient ID</span>
                <strong>
                  {selectedPatient.patientId}
                </strong>
              </div>


              <div className="detail-item">
                <span>Name</span>
                <strong>
                  {selectedPatient.name}
                </strong>
              </div>


              <div className="detail-item">
                <span>Phone</span>
                <strong>
                  {selectedPatient.phone || "-"}
                </strong>
              </div>


              <div className="detail-item">
                <span>Date of Birth</span>
                <strong>
                  {selectedPatient.dateOfBirth
                    ? new Date(
                        selectedPatient.dateOfBirth
                      ).toLocaleDateString()
                    : "-"}
                </strong>
              </div>


              <div className="detail-item">
                <span>Discharge Date</span>
                <strong>
                  {selectedPatient.dischargeDate
                    ? new Date(
                        selectedPatient.dischargeDate
                      ).toLocaleDateString()
                    : "-"}
                </strong>
              </div>


              <div className="detail-item">
                <span>Discharge Disposition</span>
                <strong>
                  {selectedPatient.dischargeDisposition ||
                    "-"}
                </strong>
              </div>


              <div className="detail-item">
                <span>Follow-up Required</span>
                <strong>
                  {selectedPatient.followUpRequired
                    ? "Yes"
                    : "No"}
                </strong>
              </div>


              <div className="detail-item">
                <span>Communication Eligible</span>

                <span
                  className={`patient-status ${
                    selectedPatient.communicationEligible
                      ? "eligible"
                      : "ineligible"
                  }`}
                >
                  {selectedPatient.communicationEligible
                    ? "ELIGIBLE"
                    : "INELIGIBLE"}
                </span>

              </div>

            </div>


            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={() =>
                  setSelectedPatient(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Patients;