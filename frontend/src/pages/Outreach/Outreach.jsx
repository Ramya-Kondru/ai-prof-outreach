import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import "./Outreach.css";

function Outreach() {
  const [outreach, setOutreach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ======================================================
  // CONVERSATION STATE
  // ======================================================

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [selectedPatientName, setSelectedPatientName] =
    useState("");

  const [conversationLoading, setConversationLoading] =
    useState(false);

  // Used to control the chat scroll position
  const messagesContainerRef = useRef(null);


  // ======================================================
  // HOSPITAL MESSAGE
  // ======================================================

  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] =
    useState(false);


  // ======================================================
  // PATIENT SIMULATOR
  // ======================================================

  const [patientMessage, setPatientMessage] =
    useState("");

  const [sendingPatientMessage, setSendingPatientMessage] =
    useState(false);


  // ======================================================
  // FETCH OUTREACH
  // ======================================================

  const fetchOutreach = async () => {
    try {
      const response = await api.get("/outreach");

      console.log(
        "Outreach:",
        response.data
      );

      setOutreach(
        response.data.outreach || []
      );

    } catch (error) {
      console.error(
        "Error fetching outreach:",
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
    fetchOutreach();
  }, []);


  // ======================================================
  // SHOW CONVERSATION FROM TOP WHEN OPENED
  // ======================================================

  useEffect(() => {
    if (
      selectedConversation &&
      messagesContainerRef.current
    ) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [selectedConversation?._id]);


  // ======================================================
  // UPDATE OUTREACH
  // ======================================================

  const updateOutreach = async (
    outreachId,
    status,
    outcome
  ) => {
    try {
      setUpdatingId(outreachId);

      const response = await api.patch(
        `/outreach/${outreachId}`,
        {
          status,
          outcome
        }
      );

      alert(response.data.message);

      await fetchOutreach();

    } catch (error) {
      console.error(
        "Error updating outreach:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update outreach"
      );

    } finally {
      setUpdatingId(null);
    }
  };


  // ======================================================
  // OPEN / CREATE CONVERSATION
  // ======================================================

  const openConversation = async (item) => {
    try {
      setConversationLoading(true);

      setSelectedPatientName(
        item.patientId?.name ||
        "Patient"
      );

      let conversation;


      // --------------------------------------------------
      // GET EXISTING CONVERSATION
      // --------------------------------------------------

      try {
        const response = await api.get(
          `/conversations/outreach/${item._id}`
        );

        conversation =
          response.data.conversation;

      } catch (error) {

        // ------------------------------------------------
        // CREATE CONVERSATION IF NOT FOUND
        // ------------------------------------------------

        if (
          error.response?.status === 404
        ) {

          const response = await api.post(
            "/conversations",
            {
              outreachId: item._id,

              patientId:
                item.patientId?._id ||
                item.patientId
            }
          );

          conversation =
            response.data.conversation;

        } else {
          throw error;
        }
      }


      // --------------------------------------------------
      // OPEN CONVERSATION
      // --------------------------------------------------

      setSelectedConversation(
        conversation
      );

    } catch (error) {

      console.error(
        "Conversation error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to open conversation"
      );

    } finally {
      setConversationLoading(false);
    }
  };


  // ======================================================
  // SEND HOSPITAL MESSAGE
  // ======================================================

  const sendMessage = async () => {

    if (
      !newMessage.trim() ||
      !selectedConversation
    ) {
      return;
    }

    try {
      setSendingMessage(true);

      const response = await api.post(
        `/conversations/${selectedConversation._id}/messages`,
        {
          sender: "HOSPITAL",
          message: newMessage.trim()
        }
      );


      // Update conversation with
      // newly added hospital message
      setSelectedConversation(
        response.data.conversation
      );


      setNewMessage("");

    } catch (error) {

      console.error(
        "Send hospital message error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to send message"
      );

    } finally {
      setSendingMessage(false);
    }
  };


  // ======================================================
  // SEND PATIENT MESSAGE
  // ======================================================

  const sendPatientMessage = async () => {

    if (
      !patientMessage.trim() ||
      !selectedConversation
    ) {
      return;
    }

    try {

      setSendingPatientMessage(true);

      const response = await api.post(
        `/conversations/${selectedConversation._id}/messages`,
        {
          sender: "PATIENT",
          message: patientMessage.trim()
        }
      );


      console.log(
        "Patient message response:",
        response.data
      );


      // Backend returns:
      //
      // PATIENT message
      // +
      // AI response
      //
      // so replace the conversation
      // with the updated conversation

      setSelectedConversation(
        response.data.conversation
      );


      setPatientMessage("");

    } catch (error) {

      console.error(
        "Send patient message error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to send patient message"
      );

    } finally {

      setSendingPatientMessage(false);
    }
  };


  // ======================================================
  // RESOLVE CONVERSATION
  // ======================================================

  const resolveConversation = async () => {

    if (!selectedConversation) {
      return;
    }

    try {

      const response = await api.patch(
        `/conversations/${selectedConversation._id}/close`
      );


      // Backend changes:
      //
      // OPEN
      // ↓
      // RESOLVED

      setSelectedConversation(
        response.data.conversation
      );

    } catch (error) {

      console.error(
        "Resolve conversation error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to resolve conversation"
      );
    }
  };


  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeConversationModal = () => {

    setSelectedConversation(null);

    setSelectedPatientName("");

    setNewMessage("");

    setPatientMessage("");
  };


  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="outreach-page">

      {/* ==================================================
          PAGE HEADER
          ================================================== */}

      <div className="page-header">

        <div>

          <h1>Outreach</h1>

          <p>
            View and manage patient outreach activities.
          </p>

        </div>

      </div>


      {/* ==================================================
          OUTREACH TABLE
          ================================================== */}

      <div className="outreach-card">

        {loading ? (

          <p>Loading outreach...</p>

        ) : outreach.length === 0 ? (

          <p>No outreach records found.</p>

        ) : (

          <div className="outreach-table">

            {/* TABLE HEADER */}

            <div className="outreach-row outreach-heading">

              <span>Patient</span>

              <span>Campaign</span>

              <span>Status</span>

              <span>Scheduled</span>

              <span>Attempt</span>

              <span>Action</span>

            </div>


            {/* OUTREACH RECORDS */}

            {outreach.map((item) => (

              <div
                className="outreach-record"
                key={item._id}
              >

                {/* MAIN ROW */}

                <div className="outreach-row">

                  {/* PATIENT */}

                  <span>
                    {item.patientId?.name ||
                      item.patientId ||
                      "-"}
                  </span>


                  {/* CAMPAIGN */}

                  <span>
                    {item.campaignId?.name ||
                      item.campaignId ||
                      "-"}
                  </span>


                  {/* STATUS */}

                  <span>

                    <span
                      className={`outreach-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>

                  </span>


                  {/* SCHEDULED */}

                  <span>

                    {item.scheduledAt
                      ? new Date(
                          item.scheduledAt
                        ).toLocaleString()
                      : "-"}

                  </span>


                  {/* ATTEMPT */}

                  <span>
                    {item.attemptNumber ?? "-"}
                  </span>


                  {/* ACTION */}

                  <span className="outreach-actions">

                    {item.status ===
                      "IN_PROGRESS" && (

                      <>

                        <button
                          className="complete-button"
                          disabled={
                            updatingId ===
                            item._id
                          }
                          onClick={() =>
                            updateOutreach(
                              item._id,
                              "COMPLETED",
                              "CONNECTED"
                            )
                          }
                        >
                          Complete
                        </button>


                        <button
                          className="failed-button"
                          disabled={
                            updatingId ===
                            item._id
                          }
                          onClick={() =>
                            updateOutreach(
                              item._id,
                              "FAILED",
                              "NO_ANSWER"
                            )
                          }
                        >
                          Failed
                        </button>

                      </>

                    )}


                    {item.status ===
                      "QUEUED" && (

                      <span className="action-text">
                        Waiting
                      </span>

                    )}


                    {item.status ===
                      "COMPLETED" && (

                      <span className="action-text">
                        Completed
                      </span>

                    )}


                    {item.status ===
                      "FAILED" && (

                      <span className="action-text">
                        Failed
                      </span>

                    )}


                    {item.status ===
                      "MANUAL_FOLLOW_UP" && (

                      <button
                        className="complete-button"
                        onClick={() =>
                          updateOutreach(
                            item._id,
                            "COMPLETED",
                            "CONNECTED"
                          )
                        }
                      >
                        Resolve
                      </button>

                    )}

                  </span>

                </div>


                {/* CONVERSATION BUTTON */}

                <div className="conversation-action">

                  <button
                    className="conversation-button"
                    onClick={() =>
                      openConversation(item)
                    }
                    disabled={
                      conversationLoading
                    }
                  >

                    {conversationLoading
                      ? "Opening..."
                      : "Open Conversation"}

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ==================================================
          CONVERSATION MODAL
          ================================================== */}

      {selectedConversation && (

        <div className="conversation-overlay">

          <div className="conversation-modal">


            {/* ==================================================
                HEADER
                ================================================== */}

            <div className="conversation-header">

              <div>

                <h2>
                  Patient Conversation
                </h2>

                <p>
                  {selectedPatientName}
                </p>

              </div>


              <button
                className="conversation-close"
                onClick={
                  closeConversationModal
                }
              >
                ×
              </button>

            </div>


            {/* ==================================================
                MESSAGES
                ================================================== */}

            <div
              className="conversation-messages"
              ref={messagesContainerRef}
            >

              {selectedConversation.messages?.length ===
              0 ? (

                <p className="empty-conversation">
                  No messages yet.
                </p>

              ) : (

                selectedConversation.messages.map(
                  (msg, index) => (

                    <div
                      key={index}
                      className={`conversation-message ${
                        msg.sender.toLowerCase()
                      }`}
                    >

                      {/* SENDER */}

                      <div className="message-sender">

                        {msg.sender === "AI"
                          ? "AI Assistant"
                          : msg.sender === "PATIENT"
                          ? selectedPatientName
                          : msg.sender === "HOSPITAL"
                          ? "Hospital"
                          : msg.sender}

                      </div>


                      {/* MESSAGE */}

                      <div className="message-text">

                        {msg.message}

                      </div>


                      {/* TIME */}

                      <div className="message-time">

                        {msg.sentAt
                          ? new Date(
                              msg.sentAt
                            ).toLocaleString()
                          : ""}

                      </div>

                    </div>

                  )
                )

              )}

            </div>


            {/* ==================================================
                PATIENT SIMULATOR
                ================================================== */}

            {selectedConversation.status ===
              "OPEN" && (

              <div className="patient-simulator">

                <div className="simulator-title">
                  Patient Simulator
                </div>


                <textarea
                  value={patientMessage}
                  onChange={(e) =>
                    setPatientMessage(
                      e.target.value
                    )
                  }
                  placeholder="Type patient's response..."
                  rows="2"
                />


                <button
                  className="patient-response-button"
                  onClick={
                    sendPatientMessage
                  }
                  disabled={
                    sendingPatientMessage ||
                    !patientMessage.trim()
                  }
                >

                  {sendingPatientMessage
                    ? "Sending..."
                    : "Send as Patient"}

                </button>

              </div>

            )}


            {/* ==================================================
                HOSPITAL REPLY
                ================================================== */}

            {selectedConversation.status ===
              "OPEN" && (

              <div className="conversation-input">

                <div className="hospital-input-label">
                  Hospital Reply
                </div>


                <textarea
                  value={newMessage}
                  onChange={(e) =>
                    setNewMessage(
                      e.target.value
                    )
                  }
                  placeholder="Reply to patient..."
                  rows="3"
                />


                <button
                  className="send-message-button"
                  onClick={sendMessage}
                  disabled={
                    sendingMessage ||
                    !newMessage.trim()
                  }
                >

                  {sendingMessage
                    ? "Sending..."
                    : "Send Reply"}

                </button>

              </div>

            )}


            {/* ==================================================
                FOOTER
                ================================================== */}

            <div className="conversation-footer">

              <span>

                Status:{" "}

                <strong>
                  {selectedConversation.status}
                </strong>

              </span>


              {selectedConversation.status ===
                "OPEN" && (

                <button
                  className="close-conversation-button"
                  onClick={
                    resolveConversation
                  }
                >
                  Resolve Conversation
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Outreach;