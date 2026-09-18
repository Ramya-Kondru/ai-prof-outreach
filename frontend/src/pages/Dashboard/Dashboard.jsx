import SummaryCards from "../../components/SummaryCards";
import RecentCampaigns from "../../components/RecentCampaigns";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>
          Overview of your patient outreach activity.
        </p>
      </div>

      <SummaryCards />

      <RecentCampaigns />
    </div>
  );
}

export default Dashboard;