import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const role = user?.role;


    return (

        <aside className="sidebar">

            <div className="sidebar-logo">
                AI.Prof
            </div>


            <nav className="sidebar-nav">

                {/* ==================================================
                    DASHBOARD
                    ================================================== */}

                <Link to="/dashboard">
                    Dashboard
                </Link>


                {/* ==================================================
                    HOSPITAL ADMIN + CAMPAIGN MANAGER
                    ================================================== */}

                {(role === "HOSPITAL_ADMIN" ||
                    role === "CAMPAIGN_MANAGER") && (

                    <>
                        <Link to="/patients">
                            Patients
                        </Link>

                        <Link to="/campaigns">
                            Campaigns
                        </Link>

                        <Link to="/eligibility">
                            Eligibility
                        </Link>

                        <Link to="/outreach">
                            Outreach
                        </Link>
                    </>
                )}


                {/* ==================================================
                    DOCUMENTATION
                    Hospital Admin + Campaign Manager + Clinical Reviewer
                    ================================================== */}

                {(role === "HOSPITAL_ADMIN" ||
                    role === "CAMPAIGN_MANAGER" ||
                    role === "CLINICAL_REVIEWER") && (

                    <Link to="/documentation">
                        Documentation
                    </Link>
                )}


                {/* ==================================================
                    QUEUE
                    Hospital Admin + Campaign Manager + Clinical Reviewer
                    ================================================== */}

                {(role === "HOSPITAL_ADMIN" ||
                    role === "CAMPAIGN_MANAGER" ||
                    role === "CLINICAL_REVIEWER") && (

                    <Link to="/queue">
                        Queue
                    </Link>
                )}


                {/* ==================================================
                    ADMIN
                    HOSPITAL ADMIN ONLY
                    ================================================== */}

                {role === "HOSPITAL_ADMIN" && (

                    <Link to="/admin">
                        Admin
                    </Link>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;