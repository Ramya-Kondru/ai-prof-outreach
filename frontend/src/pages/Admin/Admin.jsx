import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Admin.css";

function Admin() {
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const response = await api.get(
                    "/admin/my-hospital"
                );

                console.log(
                    "Hospital:",
                    response.data
                );

                setHospital(response.data.hospital);

            } catch (error) {
                console.error(
                    "Hospital access error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load hospital information"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchHospital();
    }, []);

    return (
        <div className="admin-page">

            <div className="page-header">
                <div>
                    <h1>Admin</h1>

                    <p>
                        Hospital administration and access management.
                    </p>
                </div>
            </div>

            <div className="admin-card">

                {loading && (
                    <p>Loading hospital information...</p>
                )}

                {!loading && error && (
                    <div className="admin-error">
                        <h2>Access Denied</h2>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && hospital && (
                    <>
                        <h2>Hospital Information</h2>

                        <div className="hospital-details">

                            <div>
                                <span>Hospital Name</span>
                                <strong>
                                    {hospital.name}
                                </strong>
                            </div>

                            <div>
                                <span>Hospital Code</span>
                                <strong>
                                    {hospital.code}
                                </strong>
                            </div>

                            <div>
                                <span>Contact Email</span>
                                <strong>
                                    {hospital.contactEmail}
                                </strong>
                            </div>

                            <div>
                                <span>Contact Phone</span>
                                <strong>
                                    {hospital.contactPhone || "-"}
                                </strong>
                            </div>

                            <div>
                                <span>Timezone</span>
                                <strong>
                                    {hospital.timezone}
                                </strong>
                            </div>

                            <div>
                                <span>Outbound Capacity</span>
                                <strong>
                                    {hospital.outboundCapacity}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {hospital.status}
                                </strong>
                            </div>

                            <div>
                                <span>Calling Hours</span>
                                <strong>
                                    {hospital.callingHours?.start}
                                    {" - "}
                                    {hospital.callingHours?.end}
                                </strong>
                            </div>

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default Admin;