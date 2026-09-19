import { useState } from "react";
import api from "../../services/api";
import "./AddPatient.css";

function AddPatient({ onClose, onPatientAdded }) {
  // ======================================================
  // BASIC PATIENT INFORMATION
  // ======================================================

  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeDisposition, setDischargeDisposition] =
    useState("");

  const [followUpRequired, setFollowUpRequired] =
    useState(true);

  const [communicationEligible, setCommunicationEligible] =
    useState(true);


  // ======================================================
  // CLINICAL INFORMATION
  // ======================================================

  const [diagnosis, setDiagnosis] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [symptoms, setSymptoms] = useState("");

  // ======================================================
  // VITAL SIGNS
  // ======================================================

  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [respiratoryRate, setRespiratoryRate] =
    useState("");
  const [oxygenSaturation, setOxygenSaturation] =
    useState("");

  // ======================================================
  // CLINICAL NOTES
  // ======================================================

  const [clinicalNotes, setClinicalNotes] = useState("");


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patient = {
      // --------------------------------------------------
      // BASIC INFORMATION
      // --------------------------------------------------

      patientId: patientId.trim(),

      name: name.trim(),

      phone: phone.trim(),

      dateOfBirth:
        dateOfBirth || undefined,

      dischargeDate,

      dischargeDisposition:
        dischargeDisposition || undefined,

      followUpRequired,

      communicationEligible,


      // --------------------------------------------------
      // CLINICAL INFORMATION
      // --------------------------------------------------

      clinicalData: {

        diagnosis:
          diagnosis.trim(),

        conditions:
          conditions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        medications:
          medications
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        allergies:
          allergies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        symptoms:
          symptoms
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),


        // ------------------------------------------------
        // VITAL SIGNS
        // ------------------------------------------------

        vitalSigns: {

          temperature:
            temperature
              ? Number(temperature)
              : undefined,

          heartRate:
            heartRate
              ? Number(heartRate)
              : undefined,

          bloodPressure:
            bloodPressure.trim(),

          respiratoryRate:
            respiratoryRate
              ? Number(respiratoryRate)
              : undefined,

          oxygenSaturation:
            oxygenSaturation
              ? Number(oxygenSaturation)
              : undefined
        },


        // ------------------------------------------------
        // CLINICAL NOTES
        // ------------------------------------------------

        clinicalNotes:
          clinicalNotes.trim()
      }
    };


    // ====================================================
    // SEND TO BACKEND
    // ====================================================

    try {

      const response = await api.post(
        "/patients",
        patient
      );


      console.log(
        "Patient created:",
        response.data
      );


      alert(
        "Patient added successfully!"
      );


      // Refresh patient list
      onPatientAdded();

      // Close modal
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


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div className="patient-modal-overlay">

      <div className="patient-modal">


        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="modal-header">

          <div>

            <h2>
              Add Patient
            </h2>

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


          {/* ==================================================
              PATIENT INFORMATION
              ================================================== */}

          <div className="form-section-title">
            Patient Information
          </div>


          {/* PATIENT ID */}

          <div className="form-group">

            <label>
              Patient ID
            </label>

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


          {/* NAME */}

          <div className="form-group">

            <label>
              Name
            </label>

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


          {/* PHONE */}

          <div className="form-group">

            <label>
              Phone
            </label>

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


          {/* DATE OF BIRTH */}

          <div className="form-group">

            <label>
              Date of Birth
            </label>

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) =>
                setDateOfBirth(e.target.value)
              }
            />

          </div>


          {/* DISCHARGE DATE */}

          <div className="form-group">

            <label>
              Discharge Date
            </label>

            <input
              type="date"
              value={dischargeDate}
              onChange={(e) =>
                setDischargeDate(e.target.value)
              }
              required
            />

          </div>


          {/* DISCHARGE DISPOSITION */}

          <div className="form-group">

            <label>
              Discharge Disposition
            </label>

            <select
              value={dischargeDisposition}
              onChange={(e) =>
                setDischargeDisposition(
                  e.target.value
                )
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


          {/* ==================================================
              CLINICAL INFORMATION
              ================================================== */}

          <div className="form-section-title">
            Clinical Information
          </div>


          {/* DIAGNOSIS */}

          <div className="form-group">

            <label>
              Diagnosis
            </label>

            <input
              type="text"
              placeholder="e.g. Hypertension"
              value={diagnosis}
              onChange={(e) =>
                setDiagnosis(e.target.value)
              }
            />

          </div>


          {/* CONDITIONS */}

          <div className="form-group">

            <label>
              Conditions
            </label>

            <input
              type="text"
              placeholder="e.g. Diabetes, Hypertension"
              value={conditions}
              onChange={(e) =>
                setConditions(e.target.value)
              }
            />

            <small>
              Separate multiple conditions with commas.
            </small>

          </div>


          {/* SYMPTOMS */}

          <div className="form-group">

            <label>
              Symptoms
            </label>

            <input
              type="text"
              placeholder="e.g. dizziness, headache, fatigue"
              value={symptoms}
              onChange={(e) =>
                setSymptoms(e.target.value)
              }
            />

            <small>
              Separate multiple symptoms with commas.
            </small>

          </div>


          {/* MEDICATIONS */}

          <div className="form-group">

            <label>
              Medications
            </label>

            <input
              type="text"
              placeholder="e.g. Metformin, Aspirin"
              value={medications}
              onChange={(e) =>
                setMedications(e.target.value)
              }
            />

            <small>
              Separate multiple medications with commas.
            </small>

          </div>


          {/* ALLERGIES */}

          <div className="form-group">

            <label>
              Allergies
            </label>

            <input
              type="text"
              placeholder="e.g. Penicillin, Peanuts"
              value={allergies}
              onChange={(e) =>
                setAllergies(e.target.value)
              }
            />

            <small>
              Separate multiple allergies with commas.
            </small>

          </div>


          {/* ==================================================
              VITAL SIGNS
              ================================================== */}

          <div className="form-section-title">
            Vital Signs
          </div>


          {/* TEMPERATURE */}

          <div className="form-group">

            <label>
              Temperature
            </label>

            <input
              type="number"
              step="0.1"
              placeholder="e.g. 98.6"
              value={temperature}
              onChange={(e) =>
                setTemperature(e.target.value)
              }
            />

          </div>


          {/* HEART RATE */}

          <div className="form-group">

            <label>
              Heart Rate
            </label>

            <input
              type="number"
              placeholder="e.g. 72"
              value={heartRate}
              onChange={(e) =>
                setHeartRate(e.target.value)
              }
            />

          </div>


          {/* BLOOD PRESSURE */}

          <div className="form-group">

            <label>
              Blood Pressure
            </label>

            <input
              type="text"
              placeholder="e.g. 120/80"
              value={bloodPressure}
              onChange={(e) =>
                setBloodPressure(e.target.value)
              }
            />

          </div>


          {/* RESPIRATORY RATE */}

          <div className="form-group">

            <label>
              Respiratory Rate
            </label>

            <input
              type="number"
              placeholder="e.g. 16"
              value={respiratoryRate}
              onChange={(e) =>
                setRespiratoryRate(e.target.value)
              }
            />

          </div>


          {/* OXYGEN SATURATION */}

          <div className="form-group">

            <label>
              Oxygen Saturation
            </label>

            <input
              type="number"
              step="0.1"
              placeholder="e.g. 98"
              value={oxygenSaturation}
              onChange={(e) =>
                setOxygenSaturation(e.target.value)
              }
            />

          </div>


          {/* ==================================================
              CLINICAL NOTES
              ================================================== */}

          <div className="form-group">

            <label>
              Clinical Notes
            </label>

            <textarea
              placeholder="Enter relevant clinical notes..."
              value={clinicalNotes}
              onChange={(e) =>
                setClinicalNotes(e.target.value)
              }
              rows="4"
            />

          </div>


          {/* ==================================================
              OUTREACH SETTINGS
              ================================================== */}

          <div className="form-section-title">
            Outreach Settings
          </div>


          {/* FOLLOW-UP REQUIRED */}

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


          {/* COMMUNICATION ELIGIBLE */}

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


          {/* ==================================================
              ACTIONS
              ================================================== */}

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