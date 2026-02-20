import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<AppLayout />}>
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
