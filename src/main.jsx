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
import TherapistWorkshops from './pages/TherapistWorkshops';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminDemos from './pages/AdminDemos';
import AdminWorkshops from './pages/AdminWorkshops';
import TherapistProfileView from './pages/TherapistProfileView';
import BookSession from './pages/BookSession';

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

          {/* Company portal — single shell, role-gated nav */}
          <Route path="/app" element={<RequireAuth roles={['EMPLOYEE', 'HR_ADMIN']}><AppLayout /></RequireAuth>}>
            {/* Shared */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            {/* Therapist profile & booking (shared across employee & HR) */}
            <Route path="therapist-profile/:id" element={<TherapistProfileView />} />
            <Route path="book/:id" element={<BookSession />} />

            {/* Employee & HR pages */}
            <Route path="therapists" element={<Therapists />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="workshops" element={<Workshops />} />
            <Route path="resources" element={<Resources />} />

            {/* HR-only pages */}
            <Route path="hr" element={<RequireAuth roles={['HR_ADMIN']}><HRDashboard /></RequireAuth>} />
            <Route path="hr/therapists" element={<RequireAuth roles={['HR_ADMIN']}><HRTherapists /></RequireAuth>} />
            <Route path="hr/workshops" element={<RequireAuth roles={['HR_ADMIN']}><HRWorkshops /></RequireAuth>} />
            <Route path="hr/requests" element={<RequireAuth roles={['HR_ADMIN']}><HRRequests /></RequireAuth>} />
            <Route path="hr/employees" element={<RequireAuth roles={['HR_ADMIN']}><HREmployees /></RequireAuth>} />
            <Route path="hr/insights" element={<RequireAuth roles={['HR_ADMIN']}><HRInsights /></RequireAuth>} />
            <Route path="hr/settings" element={<RequireAuth roles={['HR_ADMIN']}><HRSettings /></RequireAuth>} />
          </Route>

          {/* Therapist portal */}
          <Route path="/therapist" element={<RequireAuth roles={['THERAPIST']}><TherapistLayout /></RequireAuth>}>
            <Route index element={<TherapistDashboard />} />
            <Route path="sessions" element={<TherapistSessions />} />
            <Route path="workshops" element={<TherapistWorkshops />} />
            <Route path="profile" element={<TherapistProfile />} />
            <Route path="view/:id" element={<TherapistProfileView />} />
          </Route>

          {/* Super Admin portal */}
          <Route path="/admin" element={<RequireAuth roles={['SUPER_ADMIN']}><AdminLayout /></RequireAuth>}>
            <Route index element={<AdminDashboard />} />
            <Route path="demos" element={<AdminDemos />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="therapist/:id" element={<TherapistProfileView />} />
          </Route>
        </Routes>
        <DevRoleSwitcher />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
