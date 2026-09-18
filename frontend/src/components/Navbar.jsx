import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        navigate("/");
    };

    return (
        <header className="navbar">

            <div>
                <h2>Outreach Dashboard</h2>
            </div>

            <div className="navbar-user">

                {user ? (
                    <>
                        <div className="user-info">

                            <strong>
                                {user.name}
                            </strong>

                            <span>
                                {user.role}
                            </span>

                        </div>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                )}

            </div>

        </header>
    );
}

export default Navbar;