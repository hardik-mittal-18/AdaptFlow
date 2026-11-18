import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ROLES } from './config/roles';

// Public & Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import AuthCallback from './pages/AuthCallback';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Consumer Pages (Strictly Consumer)
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import PredictionPage from './pages/consumer/PredictionPage';
import ActivityPage from './pages/consumer/ActivityPage';
import ProfilePage from './pages/consumer/ProfilePage';
import NotificationsPage from './pages/consumer/NotificationsPage';

// Vendor Portal (Strictly Vendor)
import VendorPortalPage from './pages/vendor/VendorPortalPage';

// Staff Portal (Strictly Staff)
import StaffPortalPage from './pages/staff/StaffPortalPage';

// Admin Pages (Strictly Admin)
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import DeploymentsPage from './pages/admin/DeploymentsPage';
import LogsPage from './pages/admin/LogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Profile Completion (Post-OAuth if role needed) */}
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute>
                  <CompleteProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Shared Profile & Notifications for any authenticated user */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <NotificationsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* CONSUMER ONLY ROUTES (Strictly Consumer role) */}
            <Route
              path="/dashboard"
              element={
                <RoleRoute allow={[ROLES.CONSUMER]}>
                  <AppLayout>
                    <ConsumerDashboard />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/predictions"
              element={
                <RoleRoute allow={[ROLES.CONSUMER]}>
                  <AppLayout>
                    <PredictionPage />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <RoleRoute allow={[ROLES.CONSUMER]}>
                  <AppLayout>
                    <ActivityPage />
                  </AppLayout>
                </RoleRoute>
              }
            />

            {/* VENDOR ONLY ROUTES (Strictly Vendor role) */}
            <Route
              path="/vendor"
              element={
                <RoleRoute allow={[ROLES.VENDOR]}>
                  <AppLayout>
                    <VendorPortalPage />
                  </AppLayout>
                </RoleRoute>
              }
            />

            {/* STAFF ONLY ROUTES (Strictly Staff role) */}
            <Route
              path="/staff"
              element={
                <RoleRoute allow={[ROLES.STAFF]}>
                  <AppLayout>
                    <StaffPortalPage />
                  </AppLayout>
                </RoleRoute>
              }
            />

            {/* ADMIN ONLY ROUTES (Strictly Admin role) */}
            <Route
              path="/admin"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <UserManagementPage />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <ProductsPage />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <OrdersPage />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <AnalyticsPage />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/admin/deployments"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <DeploymentsPage />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <LogsPage />
                  </AppLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RoleRoute allow={[ROLES.ADMIN]}>
                  <AppLayout>
                    <AdminSettingsPage />
                  </AppLayout>
                </RoleRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
