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
import { ProtectedRoute } from "./components/protected-route";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="accounting" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AccountingPage />
              </ProtectedRoute>
            } />
            <Route path="ai-forecast" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <AiForecastPage />
              </ProtectedRoute>
            } />
            <Route path="assets" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <AssetsPage />
              </ProtectedRoute>
            } />
            <Route path="crm" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <CrmPage />
              </ProtectedRoute>
            } />
            <Route path="hr" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <HrPage />
              </ProtectedRoute>
            } />
            <Route path="inventory" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
                <InventoryPage />
              </ProtectedRoute>
            } />
            <Route path="notifications" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="projects" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            <Route path="purchase" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <PurchasePage />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="sales" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <SalesPage />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <UsersPage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}
