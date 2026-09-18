import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">

            <nav className="home-navbar">

                <h2>AI.Prof Outreach</h2>

                <div className="home-nav-actions">
                    <button
                        className="home-login-button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        className="home-register-button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </div>

            </nav>


            <main className="home-content">

                <section className="hero-section">

                    <div className="hero-text">

                        <p className="hero-label">
                            PATIENT OUTREACH MANAGEMENT
                        </p>

                        <h1>
                            Smarter Patient
                            <br />
                            Outreach Management
                        </h1>

                        <p className="hero-description">
                            Manage patients, campaigns, eligibility,
                            and outreach activities from one centralized
                            platform.
                        </p>

                        <div className="hero-buttons">

                            <button
                                className="primary-hero-button"
                                onClick={() => navigate("/login")}
                            >
                                Get Started
                            </button>

                            <button
                                className="secondary-hero-button"
                                onClick={() => navigate("/register")}
                            >
                                Create Account
                            </button>

                        </div>

                    </div>


                    <div className="hero-info">

                        <div className="info-card">
                            <h3>Patients</h3>
                            <p>
                                Manage patient information and
                                communication eligibility.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>Campaigns</h3>
                            <p>
                                Create and manage targeted
                                patient outreach campaigns.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>Outreach</h3>
                            <p>
                                Track queued, active, completed,
                                and follow-up activities.
                            </p>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Home;