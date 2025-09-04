import AlertsPage from "@/components/panels/alerts/page";
import ServersPage from "@/components/panels/monitoring/page";
import NetworkPage from "@/components/panels/network/page";
import ReportsPage from "@/components/panels/reports/page";
import SystemsPage from "@/components/panels/systems/page";
import DashboardPage from "@/components/panels/dashboard/page";
import GeomapPage from "@/components/panels/geomap/page";
import ApplicationsPage from "@/components/panels/applications/page";
import ProfilesPage from "./profile/page"; 
import MonitoringPage from "@/components/panels/monitoring/page";
import IntegrationPage from "./integrations/page";

export default function Panel({ active }: { active: number }) {
  const menuItems = [
    <DashboardPage />,
    <MonitoringPage />,
    <SystemsPage />,
    <IntegrationPage/>,
    <NetworkPage />,
    <ApplicationsPage />,
    <GeomapPage />,
    <AlertsPage />,
    <ReportsPage />,
	 <ProfilesPage />,
  ];

  return menuItems[active];
}
