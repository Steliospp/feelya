import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import DevRoleSwitcher from './components/DevRoleSwitcher';
import Landing from './pages/Landing';
import Login from './pages/Login';
import BookDemo from './pages/BookDemo';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Therapists from './pages/Therapists';
import Sessions from './pages/Sessions';
import Workshops from './pages/Workshops';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import HRLayout from './components/HRLayout';
import HRDashboard from './pages/HRDashboard';
import HRTherapists from './pages/HRTherapists';
import HRWorkshops from './pages/HRWorkshops';
import HRRequests from './pages/HRRequests';
import HREmployees from './pages/HREmployees';
import HRInsights from './pages/HRInsights';
import HRSettings from './pages/HRSettings';
import TherapistLayout from './components/TherapistLayout';
import TherapistDashboard from './pages/TherapistDashboard';
import TherapistSessions from './pages/TherapistSessions';
import TherapistProfile from './pages/TherapistProfile';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminDemos from './pages/AdminDemos';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/signup" element={<BookDemo />} />

          {/* Employee app */}
          <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="therapists" element={<Therapists />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="workshops" element={<Workshops />} />
            <Route path="resources" element={<Resources />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* HR Admin routes */}
          <Route path="/app/hr" element={<RequireAuth roles={['HR_ADMIN', 'SUPER_ADMIN']}><HRLayout /></RequireAuth>}>
            <Route index element={<HRDashboard />} />
            <Route path="therapists" element={<HRTherapists />} />
            <Route path="workshops" element={<HRWorkshops />} />
            <Route path="requests" element={<HRRequests />} />
            <Route path="employees" element={<HREmployees />} />
            <Route path="insights" element={<HRInsights />} />
            <Route path="settings" element={<HRSettings />} />
          </Route>

          {/* Therapist portal routes */}
          <Route path="/therapist" element={<RequireAuth roles={['THERAPIST', 'SUPER_ADMIN']}><TherapistLayout /></RequireAuth>}>
            <Route index element={<TherapistDashboard />} />
            <Route path="sessions" element={<TherapistSessions />} />
            <Route path="profile" element={<TherapistProfile />} />
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
