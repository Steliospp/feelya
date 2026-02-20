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
import StartPage from './app/user/StartPage';
import ActivityPage from './app/user/ActivityPage';
import CommunityPage from './app/user/CommunityPage';
import GuideProfilePage from './app/user/GuideProfilePage';
import ProfilePage from './app/user/ProfilePage';

// HR portal
import HRShell from './app/hr/HRShell';
import OverviewPage from './app/hr/OverviewPage';
import WorkshopsPage from './app/hr/WorkshopsPage';
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
            <Route path="community" element={<CommunityPage />} />
            <Route path="start" element={<StartPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="guide/:id" element={<GuideProfilePage />} />
          </Route>

          {/* HR Portal */}
          <Route path="/hr" element={<RequireAuth roles={['HR_ADMIN', 'SUPER_ADMIN']}><HRShell /></RequireAuth>}>
            <Route index element={<OverviewPage />} />
            <Route path="workshops" element={<WorkshopsPage />} />
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
