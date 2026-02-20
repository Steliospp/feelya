import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import DevRoleSwitcher from './components/DevRoleSwitcher';
import Landing from './pages/Landing';
import Login from './pages/Login';

// User app
import UserShell from './app/user/UserShell';
import HomePage from './app/user/HomePage';
import SessionsPage from './app/user/SessionsPage';
import TherapistDirectoryPage from './app/user/TherapistDirectoryPage';
import TherapistProfilePage from './app/user/TherapistProfilePage';
import WorkshopsPage from './app/user/WorkshopsPage';
import ResourcesPage from './app/user/ResourcesPage';
import ProfilePage from './app/user/ProfilePage';

// Therapist portal
import TherapistShell from './app/therapist/TherapistShell';
import TherapistDashboardPage from './app/therapist/DashboardPage';
import TherapistSchedulePage from './app/therapist/SchedulePage';
import TherapistClientsPage from './app/therapist/ClientsPage';
import TherapistWorkshopsPage from './app/therapist/WorkshopsPage';
import TherapistProfilePageT from './app/therapist/ProfilePage';

// HR portal
import HRShell from './app/hr/HRShell';
import OverviewPage from './app/hr/OverviewPage';
import HRWorkshopsPage from './app/hr/WorkshopsPage';
import RequestsPage from './app/hr/RequestsPage';
import HREmployeesPage from './app/hr/EmployeesPage';
import InsightsPage from './app/hr/InsightsPage';
import SettingsPage from './app/hr/SettingsPage';

// Super admin
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminDemos from './pages/AdminDemos';

function BookDemoRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
    setTimeout(() => {
      const el = document.getElementById('get-started');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [navigate]);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book-demo" element={<BookDemoRedirect />} />
          <Route path="/signup" element={<BookDemoRedirect />} />

          {/* User app (any authenticated user) */}
          <Route path="/app" element={<RequireAuth><UserShell /></RequireAuth>}>
            <Route index element={<HomePage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="therapists" element={<TherapistDirectoryPage />} />
            <Route path="therapist/:id" element={<TherapistProfilePage />} />
            <Route path="workshops" element={<WorkshopsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Therapist Portal */}
          <Route path="/therapist" element={<RequireAuth roles={['THERAPIST', 'SUPER_ADMIN']}><TherapistShell /></RequireAuth>}>
            <Route index element={<TherapistDashboardPage />} />
            <Route path="schedule" element={<TherapistSchedulePage />} />
            <Route path="clients" element={<TherapistClientsPage />} />
            <Route path="workshops" element={<TherapistWorkshopsPage />} />
            <Route path="profile" element={<TherapistProfilePageT />} />
          </Route>

          {/* HR Portal */}
          <Route path="/hr" element={<RequireAuth roles={['HR_ADMIN', 'SUPER_ADMIN']}><HRShell /></RequireAuth>}>
            <Route index element={<OverviewPage />} />
            <Route path="workshops" element={<HRWorkshopsPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="employees" element={<HREmployeesPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Super Admin routes */}
          <Route path="/admin" element={<RequireAuth roles={['SUPER_ADMIN']}><AdminLayout /></RequireAuth>}>
            <Route index element={<AdminDashboard />} />
            <Route path="demos" element={<AdminDemos />} />
          </Route>
        </Routes>
        <DevRoleSwitcher />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
