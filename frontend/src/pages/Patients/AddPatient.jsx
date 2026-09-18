import { useState } from "react";
import api from "../../services/api";
import "./AddPatient.css";

function AddPatient({ onClose, onPatientAdded }) {
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeDisposition, setDischargeDisposition] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(true);
  const [communicationEligible, setCommunicationEligible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patient = {
      patientId: patientId.trim(),
      name: name.trim(),
      phone: phone.trim(),
      dateOfBirth: dateOfBirth || undefined,
      dischargeDate,
      dischargeDisposition: dischargeDisposition || undefined,
      followUpRequired,
      communicationEligible,
    };

    try {
      const response = await api.post("/patients", patient);

      console.log("Patient created:", response.data);

      alert("Patient added successfully!");

      onPatientAdded();
      onClose();

    } catch (error) {
      console.error(
        "Error creating patient:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to add patient"
      );
    }
  };

  return (
    <div className="patient-modal-overlay">

      <div className="patient-modal">

        <div className="modal-header">

          <div>
            <h2>Add Patient</h2>

            <p>
              Add a new patient to the system.
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          {/* Patient ID */}

          <div className="form-group">

            <label>Patient ID</label>

            <input
              type="text"
              placeholder="e.g. P003"
              value={patientId}
              onChange={(e) =>
                setPatientId(e.target.value)
              }
              required
            />

          </div>


          {/* Name */}

          <div className="form-group">

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter patient name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>


          {/* Phone */}

          <div className="form-group">

            <label>Phone</label>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
            />

          </div>


          {/* Date of Birth */}

          <div className="form-group">

            <label>Date of Birth</label>

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) =>
                setDateOfBirth(e.target.value)
              }
            />

          </div>


          {/* Discharge Date */}

          <div className="form-group">

            <label>Discharge Date</label>

            <input
              type="date"
              value={dischargeDate}
              onChange={(e) =>
                setDischargeDate(e.target.value)
              }
              required
            />

          </div>


          {/* Discharge Disposition */}

          <div className="form-group">

            <label>Discharge Disposition</label>

            <select
              value={dischargeDisposition}
              onChange={(e) =>
                setDischargeDisposition(e.target.value)
              }
            >

              <option value="">
                Select disposition
              </option>

              <option value="HOME">
                Home
              </option>

              <option value="TRANSFERRED">
                Transferred
              </option>

              <option value="SKILLED_NURSING">
                Skilled Nursing
              </option>

              <option value="OTHER">
                Other
              </option>

            </select>

          </div>


          {/* Follow-up Required */}

          <div className="checkbox-group">

            <label>

              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={(e) =>
                  setFollowUpRequired(
                    e.target.checked
                  )
                }
              />

              Follow-up Required

            </label>

          </div>


          {/* Communication Eligible */}

          <div className="checkbox-group">

            <label>

              <input
                type="checkbox"
                checked={communicationEligible}
                onChange={(e) =>
                  setCommunicationEligible(
                    e.target.checked
                  )
                }
              />

              Communication Eligible

            </label>

          </div>


          {/* Actions */}

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
              Add Patient
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddPatient;