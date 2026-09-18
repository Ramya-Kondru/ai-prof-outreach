import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            console.log(
                "Login successful:",
                response.data
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            alert("Login successful!");

            navigate("/dashboard");

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>AI.Prof Outreach</h1>

                <p className="login-subtitle">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button type="submit">
                        Sign In
                    </button>

                </form>


                {/* Register link */}

                <p className="register-link">
                    Don't have an account?{" "}
                    <span
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        <b className="register">Register</b>
                    </span>
                </p>

            </div>

        </div>
    );
}

export default Login;