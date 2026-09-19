import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Documentation.css";

function Documentation() {

    const [communications, setCommunications] = useState([]);
    const [observations, setObservations] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [escalations, setEscalations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    // ======================================================
    // FETCH DOCUMENTATION
    // ======================================================

    const fetchDocumentation = async () => {

        try {

            setLoading(true);
            setError(false);

            const [
                communicationsResponse,
                observationsResponse,
                followUpsResponse,
                escalationsResponse
            ] = await Promise.all([

                api.get(
                    "/clinical-records/communications"
                ),

                api.get(
                    "/clinical-records/observations"
                ),

                api.get(
                    "/clinical-records/follow-ups"
                ),

                api.get(
                    "/clinical-records/escalations"
                )

            ]);


            console.log(
                "Communications:",
                communicationsResponse.data
            );

            console.log(
                "Observations:",
                observationsResponse.data
            );

            console.log(
                "Follow-ups:",
                followUpsResponse.data
            );

            console.log(
                "Escalations:",
                escalationsResponse.data
            );


            setCommunications(
                communicationsResponse.data.communications || []
            );

            setObservations(
                observationsResponse.data.observations || []
            );

            setFollowUps(
                followUpsResponse.data.followUps || []
            );

            setEscalations(
                escalationsResponse.data.escalations || []
            );


        } catch (error) {

            console.error(
                "Documentation fetch error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            console.error(
                "Status:",
                error.response?.status
            );

            setError(true);

        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        fetchDocumentation();

    }, []);


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div className="documentation-page">

                <div className="documentation-header">

                    <h1>
                        Documentation
                    </h1>

                    <p>
                        Clinical communications, observations,
                        follow-ups and escalations.
                    </p>

                </div>

                <div className="documentation-card">

                    <p className="documentation-loading">
                        Loading documentation...
                    </p>

                </div>

            </div>

        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {

        return (

            <div className="documentation-page">

                <div className="documentation-header">

                    <h1>
                        Documentation
                    </h1>

                    <p>
                        Clinical communications, observations,
                        follow-ups and escalations.
                    </p>

                </div>

                <div className="documentation-card">

                    <p className="documentation-error">
                        Unable to load documentation.
                    </p>

                    <button
                        className="documentation-retry"
                        onClick={fetchDocumentation}
                    >
                        Retry
                    </button>

                </div>

            </div>

        );

    }


    // ======================================================
    // PAGE
    // ======================================================

    return (

        <div className="documentation-page">


            {/* ==================================================
                HEADER
                ================================================== */}

            <div className="documentation-header">

                <h1>
                    Documentation
                </h1>

                <p>
                    Clinical communications, observations,
                    follow-ups and escalations.
                </p>

            </div>


            {/* ==================================================
                COMMUNICATIONS
                ================================================== */}

            <div className="documentation-card">

                <div className="documentation-section-header">

                    <h2>
                        Communications
                    </h2>

                    <span>
                        {communications.length}
                    </span>

                </div>


                {communications.length === 0 ? (

                    <p className="documentation-empty">
                        No communications documented yet.
                    </p>

                ) : (

                    <div className="documentation-list">

                        {communications.map(
                            (communication) => (

                                <div
                                    className="documentation-item"
                                    key={communication._id}
                                >

                                    <div className="documentation-item-top">

                                        <strong>
                                            {communication.patientId?.name ||
                                                "Patient"}
                                        </strong>

                                        <span>
                                            {communication.direction}
                                        </span>

                                    </div>


                                    <p>
                                        {communication.message}
                                    </p>


                                    <div className="documentation-meta">

                                        <span>
                                            Sender:{" "}
                                            {communication.sender}
                                        </span>

                                        <span>
                                            Channel:{" "}
                                            {communication.channel}
                                        </span>

                                        <span>
                                            {communication.communicatedAt
                                                ? new Date(
                                                    communication.communicatedAt
                                                ).toLocaleString()
                                                : ""}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ==================================================
                OBSERVATIONS
                ================================================== */}

            <div className="documentation-card">

                <div className="documentation-section-header">

                    <h2>
                        Observations
                    </h2>

                    <span>
                        {observations.length}
                    </span>

                </div>


                {observations.length === 0 ? (

                    <p className="documentation-empty">
                        No observations documented yet.
                    </p>

                ) : (

                    <div className="documentation-list">

                        {observations.map(
                            (observation) => (

                                <div
                                    className="documentation-item"
                                    key={observation._id}
                                >

                                    <div className="documentation-item-top">

                                        <strong>
                                            {observation.patientId?.name ||
                                                "Patient"}
                                        </strong>

                                        <span>
                                            {observation.status}
                                        </span>

                                    </div>


                                    <p>
                                        <strong>
                                            {observation.name}
                                        </strong>
                                    </p>


                                    <p>
                                        {observation.value}
                                    </p>


                                    <div className="documentation-meta">

                                        <span>
                                            Type:{" "}
                                            {observation.type}
                                        </span>

                                        <span>
                                            Source:{" "}
                                            {observation.source}
                                        </span>

                                        <span>
                                            {observation.observedAt
                                                ? new Date(
                                                    observation.observedAt
                                                ).toLocaleString()
                                                : ""}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ==================================================
                FOLLOW-UPS
                ================================================== */}

            <div className="documentation-card">

                <div className="documentation-section-header">

                    <h2>
                        Follow-ups
                    </h2>

                    <span>
                        {followUps.length}
                    </span>

                </div>


                {followUps.length === 0 ? (

                    <p className="documentation-empty">
                        No follow-ups documented yet.
                    </p>

                ) : (

                    <div className="documentation-list">

                        {followUps.map(
                            (followUp) => (

                                <div
                                    className="documentation-item"
                                    key={followUp._id}
                                >

                                    <div className="documentation-item-top">

                                        <strong>
                                            {followUp.patientId?.name ||
                                                "Patient"}
                                        </strong>

                                        <span>
                                            {followUp.status}
                                        </span>

                                    </div>


                                    <p>
                                        <strong>
                                            {followUp.type}
                                        </strong>
                                    </p>


                                    <p>
                                        {followUp.reason}
                                    </p>


                                    <div className="documentation-meta">

                                        {followUp.dueDate && (

                                            <span>
                                                Due:{" "}
                                                {new Date(
                                                    followUp.dueDate
                                                ).toLocaleDateString()}
                                            </span>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ==================================================
                ESCALATIONS
                ================================================== */}

            <div className="documentation-card">

                <div className="documentation-section-header">

                    <h2>
                        Escalations
                    </h2>

                    <span>
                        {escalations.length}
                    </span>

                </div>


                {escalations.length === 0 ? (

                    <p className="documentation-empty">
                        No escalations documented yet.
                    </p>

                ) : (

                    <div className="documentation-list">

                        {escalations.map(
                            (escalation) => (

                                <div
                                    className="documentation-item escalation-item"
                                    key={escalation._id}
                                >

                                    <div className="documentation-item-top">

                                        <strong>
                                            {escalation.patientId?.name ||
                                                "Patient"}
                                        </strong>

                                        <span>
                                            {escalation.urgency}
                                        </span>

                                    </div>


                                    <p>
                                        {escalation.reason}
                                    </p>


                                    <div className="documentation-meta">

                                        <span>
                                            Status:{" "}
                                            {escalation.status}
                                        </span>

                                        <span>
                                            Trigger:{" "}
                                            {escalation.trigger}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


        </div>

    );

}

export default Documentation;