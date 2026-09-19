import { useEffect, useState } from "react";
import AddPatient from "./AddPatient";
import api from "../../services/api";
import "./Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ======================================================
  // CLINICAL DATA
  // ======================================================

  const [clinicalData, setClinicalData] = useState({
    diagnosis: "",
    conditions: "",
    medications: "",
    allergies: "",
    symptoms: "",
    temperature: "",
    heartRate: "",
    bloodPressure: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    clinicalNotes: ""
  });

  const [savingClinicalData, setSavingClinicalData] =
    useState(false);


  // ======================================================
  // FETCH PATIENTS
  // ======================================================

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


  // ======================================================
  // INITIAL FETCH
  // ======================================================

  useEffect(() => {
    fetchPatients();
  }, []);


  // ======================================================
  // LOAD CLINICAL DATA
  // ======================================================

  const loadClinicalData = (patient) => {

    const clinical =
      patient.clinicalData || {};

    const vitals =
      clinical.vitalSigns || {};


    setClinicalData({

      diagnosis:
        clinical.diagnosis || "",

      conditions:
        clinical.conditions?.join(", ") || "",

      medications:
        clinical.medications?.join(", ") || "",

      allergies:
        clinical.allergies?.join(", ") || "",

      symptoms:
        clinical.symptoms?.join(", ") || "",

      temperature:
        vitals.temperature ?? "",

      heartRate:
        vitals.heartRate ?? "",

      bloodPressure:
        vitals.bloodPressure || "",

      respiratoryRate:
        vitals.respiratoryRate ?? "",

      oxygenSaturation:
        vitals.oxygenSaturation ?? "",

      clinicalNotes:
        clinical.clinicalNotes || ""

    });
  };


  // ======================================================
  // OPEN PATIENT DETAILS
  // ======================================================

  const openPatientDetails = (patient) => {

    setSelectedPatient(patient);

    loadClinicalData(patient);
  };


  // ======================================================
  // SAVE CLINICAL DATA
  // ======================================================

  const saveClinicalData = async () => {

    if (!selectedPatient) {
      return;
    }


    try {

      setSavingClinicalData(true);


      const payload = {

        diagnosis:
          clinicalData.diagnosis.trim(),


        conditions:
          clinicalData.conditions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),


        medications:
          clinicalData.medications
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),


        allergies:
          clinicalData.allergies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),


        symptoms:
          clinicalData.symptoms
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),


        vitalSigns: {

          temperature:
            clinicalData.temperature
              ? Number(
                  clinicalData.temperature
                )
              : undefined,


          heartRate:
            clinicalData.heartRate
              ? Number(
                  clinicalData.heartRate
                )
              : undefined,


          bloodPressure:
            clinicalData.bloodPressure.trim(),


          respiratoryRate:
            clinicalData.respiratoryRate
              ? Number(
                  clinicalData.respiratoryRate
                )
              : undefined,


          oxygenSaturation:
            clinicalData.oxygenSaturation
              ? Number(
                  clinicalData.oxygenSaturation
                )
              : undefined

        },


        clinicalNotes:
          clinicalData.clinicalNotes.trim()

      };


      // ==================================================
      // SAVE TO BACKEND
      // ==================================================

      const response = await api.put(
        `/patients/${selectedPatient._id}/clinical`,
        payload
      );


      console.log(
        "Clinical data saved:",
        response.data
      );


      // ==================================================
      // UPDATE SELECTED PATIENT
      // ==================================================

      setSelectedPatient(
        response.data.patient
      );


      // ==================================================
      // REFRESH CLINICAL DATA IN FORM
      // ==================================================

      loadClinicalData(
        response.data.patient
      );


      // ==================================================
      // REFRESH PATIENT LIST
      // ==================================================

      await fetchPatients();


      alert(
        "Clinical data saved successfully!"
      );


    } catch (error) {

      console.error(
        "Save clinical data error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to save clinical data"
      );


    } finally {

      setSavingClinicalData(false);
    }
  };


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div className="patients-page">


      {/* ==================================================
          PAGE HEADER
          ================================================== */}

      <div className="page-header">

        <div>

          <h1>
            Patients
          </h1>

          <p>
            View and manage patient information.
          </p>

        </div>


        <button
          className="add-patient-button"
          onClick={() =>
            setShowAddForm(true)
          }
        >
          + Add Patient
        </button>

      </div>


      {/* ==================================================
          PATIENT TABLE
          ================================================== */}

      <div className="patients-card">

        {loading ? (

          <p>
            Loading patients...
          </p>

        ) : patients.length === 0 ? (

          <p>
            No patients found.
          </p>

        ) : (

          <div className="patients-table">


            {/* TABLE HEADER */}

            <div className="patient-row patient-heading">

              <span>
                Name
              </span>

              <span>
                Patient ID
              </span>

              <span>
                Discharge Date
              </span>

              <span>
                Communication
              </span>

              <span>
                Action
              </span>

            </div>


            {/* PATIENTS */}

            {patients.map((patient) => (

              <div
                className="patient-row"
                key={patient._id}
              >


                {/* NAME */}

                <span>
                  {patient.name}
                </span>


                {/* PATIENT ID */}

                <span>
                  {patient.patientId}
                </span>


                {/* DISCHARGE DATE */}

                <span>

                  {patient.dischargeDate
                    ? new Date(
                        patient.dischargeDate
                      ).toLocaleDateString()
                    : "-"}

                </span>


                {/* COMMUNICATION */}

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


                {/* VIEW */}

                <button
                  className="view-button"
                  onClick={() =>
                    openPatientDetails(patient)
                  }
                >
                  View
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ==================================================
          ADD PATIENT MODAL
          ================================================== */}

      {showAddForm && (

        <AddPatient

          onClose={() =>
            setShowAddForm(false)
          }

          onPatientAdded={
            fetchPatients
          }

        />

      )}


      {/* ==================================================
          PATIENT DETAILS MODAL
          ================================================== */}

      {selectedPatient && (

        <div className="patient-modal-overlay">

          <div className="patient-details-modal">


            {/* ==================================================
                MODAL HEADER
                ================================================== */}

            <div className="modal-header">

              <div>

                <h2>
                  Patient Details
                </h2>

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


            {/* ==================================================
                BASIC PATIENT DETAILS
                ================================================== */}

            <div className="patient-details">


              {/* PATIENT ID */}

              <div className="detail-item">

                <span>
                  Patient ID
                </span>

                <strong>
                  {selectedPatient.patientId}
                </strong>

              </div>


              {/* NAME */}

              <div className="detail-item">

                <span>
                  Name
                </span>

                <strong>
                  {selectedPatient.name}
                </strong>

              </div>


              {/* PHONE */}

              <div className="detail-item">

                <span>
                  Phone
                </span>

                <strong>
                  {selectedPatient.phone || "-"}
                </strong>

              </div>


              {/* DATE OF BIRTH */}

              <div className="detail-item">

                <span>
                  Date of Birth
                </span>

                <strong>

                  {selectedPatient.dateOfBirth
                    ? new Date(
                        selectedPatient.dateOfBirth
                      ).toLocaleDateString()
                    : "-"}

                </strong>

              </div>


              {/* DISCHARGE DATE */}

              <div className="detail-item">

                <span>
                  Discharge Date
                </span>

                <strong>

                  {selectedPatient.dischargeDate
                    ? new Date(
                        selectedPatient.dischargeDate
                      ).toLocaleDateString()
                    : "-"}

                </strong>

              </div>


              {/* DISCHARGE DISPOSITION */}

              <div className="detail-item">

                <span>
                  Discharge Disposition
                </span>

                <strong>

                  {selectedPatient.dischargeDisposition ||
                    "-"}

                </strong>

              </div>


              {/* FOLLOW UP */}

              <div className="detail-item">

                <span>
                  Follow-up Required
                </span>

                <strong>

                  {selectedPatient.followUpRequired
                    ? "Yes"
                    : "No"}

                </strong>

              </div>


              {/* COMMUNICATION */}

              <div className="detail-item">

                <span>
                  Communication Eligible
                </span>


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


            {/* ==================================================
                CLINICAL INFORMATION
                ================================================== */}

            <div className="clinical-section">


              <h3>
                Clinical Information
              </h3>


              <div className="clinical-form">


                {/* DIAGNOSIS */}

                <div className="clinical-field">

                  <label>
                    Diagnosis
                  </label>

                  <input
                    type="text"
                    value={
                      clinicalData.diagnosis
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        diagnosis:
                          e.target.value
                      })
                    }
                    placeholder="e.g. Hypertension"
                  />

                </div>


                {/* CONDITIONS */}

                <div className="clinical-field">

                  <label>
                    Conditions
                  </label>

                  <input
                    type="text"
                    value={
                      clinicalData.conditions
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        conditions:
                          e.target.value
                      })
                    }
                    placeholder="e.g. Diabetes, Hypertension"
                  />

                </div>


                {/* MEDICATIONS */}

                <div className="clinical-field">

                  <label>
                    Medications
                  </label>

                  <input
                    type="text"
                    value={
                      clinicalData.medications
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        medications:
                          e.target.value
                      })
                    }
                    placeholder="e.g. Metformin, Amlodipine"
                  />

                </div>


                {/* ALLERGIES */}

                <div className="clinical-field">

                  <label>
                    Allergies
                  </label>

                  <input
                    type="text"
                    value={
                      clinicalData.allergies
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        allergies:
                          e.target.value
                      })
                    }
                    placeholder="e.g. Penicillin"
                  />

                </div>


                {/* SYMPTOMS */}

                <div className="clinical-field">

                  <label>
                    Symptoms
                  </label>

                  <input
                    type="text"
                    value={
                      clinicalData.symptoms
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        symptoms:
                          e.target.value
                      })
                    }
                    placeholder="e.g. Chest pain, dizziness"
                  />

                </div>


                {/* TEMPERATURE */}

                <div className="clinical-field">

                  <label>
                    Temperature
                  </label>

                  <input
                    type="number"
                    value={
                      clinicalData.temperature
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        temperature:
                          e.target.value
                      })
                    }
                    placeholder="°F"
                  />

                </div>


                {/* HEART RATE */}

                <div className="clinical-field">

                  <label>
                    Heart Rate
                  </label>

                  <input
                    type="number"
                    value={
                      clinicalData.heartRate
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        heartRate:
                          e.target.value
                      })
                    }
                    placeholder="BPM"
                  />

                </div>


                {/* BLOOD PRESSURE */}

                <div className="clinical-field">

                  <label>
                    Blood Pressure
                  </label>

                  <input
                    type="text"
                    value={
                      clinicalData.bloodPressure
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        bloodPressure:
                          e.target.value
                      })
                    }
                    placeholder="e.g. 120/80"
                  />

                </div>


                {/* RESPIRATORY RATE */}

                <div className="clinical-field">

                  <label>
                    Respiratory Rate
                  </label>

                  <input
                    type="number"
                    value={
                      clinicalData.respiratoryRate
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        respiratoryRate:
                          e.target.value
                      })
                    }
                    placeholder="Breaths/min"
                  />

                </div>


                {/* OXYGEN SATURATION */}

                <div className="clinical-field">

                  <label>
                    Oxygen Saturation
                  </label>

                  <input
                    type="number"
                    value={
                      clinicalData.oxygenSaturation
                    }
                    onChange={(e) =>
                      setClinicalData({
                        ...clinicalData,
                        oxygenSaturation:
                          e.target.value
                      })
                    }
                    placeholder="%"
                  />

                </div>

              </div>


              {/* ==================================================
                  CLINICAL NOTES
                  ================================================== */}

              <div className="clinical-field">

                <label>
                  Clinical Notes
                </label>

                <textarea
                  value={
                    clinicalData.clinicalNotes
                  }
                  onChange={(e) =>
                    setClinicalData({
                      ...clinicalData,
                      clinicalNotes:
                        e.target.value
                    })
                  }
                  placeholder="Enter relevant clinical notes..."
                  rows="4"
                />

              </div>


              {/* ==================================================
                  SAVE CLINICAL DATA
                  ================================================== */}

              <button
                className="save-clinical-button"
                onClick={saveClinicalData}
                disabled={
                  savingClinicalData
                }
              >

                {savingClinicalData
                  ? "Saving..."
                  : "Save Clinical Data"}

              </button>

            </div>


            {/* ==================================================
                MODAL ACTIONS
                ================================================== */}

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