import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import DevRoleSwitcher from './components/DevRoleSwitcher';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Therapists from './pages/Therapists';
import Employees from './pages/Employees';
import Sessions from './pages/Sessions';
import Resources from './pages/Resources';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import SelfTest from './pages/SelfTest';
import OrgDashboard from './pages/OrgDashboard';
import Team from './pages/Team';
import HRLayout from './components/HRLayout';
import HRDashboard from './pages/HRDashboard';
import HREmployees from './pages/HREmployees';
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

          {/* Employee app (any authenticated user) */}
          <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="therapists" element={<Therapists />} />
            <Route path="employees" element={<Employees />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="resources" element={<Resources />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="self-test" element={<SelfTest />} />
            <Route path="org" element={<OrgDashboard />} />
            <Route path="team" element={<Team />} />
          </Route>

          {/* HR Admin routes */}
          <Route path="/app/hr" element={<RequireAuth roles={['HR_ADMIN', 'SUPER_ADMIN']}><HRLayout /></RequireAuth>}>
            <Route index element={<HRDashboard />} />
            <Route path="employees" element={<HREmployees />} />
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
