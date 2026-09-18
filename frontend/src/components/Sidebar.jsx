import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                AI.Prof
            </div>

            <nav className="sidebar-nav">

                <Link to="/dashboard">
                    Dashboard
                </Link>

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

                <Link to="/queue">
                    Queue
                </Link>

                {user?.role === "HOSPITAL_ADMIN" && (
                    <Link to="/admin">
                        Admin
                    </Link>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;