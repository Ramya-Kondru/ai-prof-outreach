import { BrowserRouter, Routes, Route } from "react-router-dom";

import Patients from "./pages/Patients/Patients";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Campaigns from "./pages/Campaigns/Campaigns";
import Register from "./pages/Register/Register";
import Eligibility from "./pages/Eligibility/Eligibility";
import Outreach from "./pages/Outreach/Outreach";
import Queue from "./pages/Queue/Queue";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import AITest from "./pages/AITest/AITest";
import Documentation from "./pages/Documentation/Documentation";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ==================================================
                    PUBLIC ROUTES
                ================================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==================================================
                    AUTHENTICATED APPLICATION
                ================================================== */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<DashboardLayout />}>


                        {/* ==================================================
                            DASHBOARD
                            All authenticated users
                        ================================================== */}

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />


                        {/* ==================================================
                            HOSPITAL ADMIN + CAMPAIGN MANAGER
                        ================================================== */}

                        <Route element={
                            <RoleRoute
                                allowedRoles={[
                                    "HOSPITAL_ADMIN",
                                    "CAMPAIGN_MANAGER"
                                ]}
                            />
                        }>

                            <Route
                                path="/patients"
                                element={<Patients />}
                            />

                            <Route
                                path="/campaigns"
                                element={<Campaigns />}
                            />

                            <Route
                                path="/eligibility"
                                element={<Eligibility />}
                            />

                            <Route
                                path="/outreach"
                                element={<Outreach />}
                            />

                        </Route>


                        {/* ==================================================
                            CLINICAL REVIEWER + HOSPITAL ADMIN
                        ================================================== */}

                        <Route element={
    <RoleRoute
        allowedRoles={[
            "HOSPITAL_ADMIN",
            "CAMPAIGN_MANAGER",
            "CLINICAL_REVIEWER"
        ]}
    />
}>
    <Route
        path="/queue"
        element={<Queue />}
    />
</Route>

                        {/* ==================================================
                            DOCUMENTATION
                            All authenticated users
                        ================================================== */}

                        <Route
                            path="/documentation"
                            element={<Documentation />}
                        />


                        {/* ==================================================
                            ADMIN
                            HOSPITAL ADMIN ONLY
                        ================================================== */}

                        <Route element={
                            <RoleRoute
                                allowedRoles={[
                                    "HOSPITAL_ADMIN"
                                ]}
                            />
                        }>

                            <Route
                                path="/admin"
                                element={<Admin />}
                            />

                        </Route>


                        {/* ==================================================
                            AI TEST
                            Currently available to all authenticated users
                        ================================================== */}

                        <Route
                            path="/ai-test"
                            element={<AITest />}
                        />


                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;