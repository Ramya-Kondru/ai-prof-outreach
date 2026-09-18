import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Register.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                role,
            });

            console.log("Registration successful:", response.data);

            alert("Registration successful!");

            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <h1>AI.Prof Outreach</h1>

                <p className="register-subtitle">
                    Create your account
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="HOSPITAL_ADMIN">Hospital Admin</option>
                            <option value="CAMPAIGN_MANAGER">Campaign Manager</option>
                            <option value="CLINICAL_REVIEWER">Clinical Reviewer</option>
                        </select>
                    </div>

                    <button type="submit">
                        Create Account
                    </button>

                </form>

                <p className="login-link">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")}>
                        Sign in
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Register;