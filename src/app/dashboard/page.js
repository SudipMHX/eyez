import DashboardOverview from "./dashboard-client";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your application settings and data.",
};

export default function AdminPage() {
  return <DashboardOverview />;
}
