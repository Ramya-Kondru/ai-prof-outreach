import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <Navbar />

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;