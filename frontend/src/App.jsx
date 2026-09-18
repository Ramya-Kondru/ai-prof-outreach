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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
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


        {/* Protected Application */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

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

            <Route
              path="/queue"
              element={<Queue />}
            />

            <Route
              path="/admin"
              element={<Admin />}
            />
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