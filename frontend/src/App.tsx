import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import AppLayout from "./pages/AppLayout";
import AuthPage from "./pages/auth";
import IndexPage from "./pages/index";
import DashboardPage from "./pages/dashboard";
import AccountingPage from "./pages/accounting";
import AiForecastPage from "./pages/ai-forecast";
import AssetsPage from "./pages/assets";
import CrmPage from "./pages/crm";
import HrPage from "./pages/hr";
import InventoryPage from "./pages/inventory";
import NotificationsPage from "./pages/notifications";
import ProjectsPage from "./pages/projects";
import PurchasePage from "./pages/purchase";
import ReportsPage from "./pages/reports";
import SalesPage from "./pages/sales";
import UsersPage from "./pages/users";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="accounting" element={<AccountingPage />} />
            <Route path="ai-forecast" element={<AiForecastPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="crm" element={<CrmPage />} />
            <Route path="hr" element={<HrPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="purchase" element={<PurchasePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}
