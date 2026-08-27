import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login'; 
import Signup from './Signup';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import PatientProfile from './Components/PatientProfile';
import PatientOnboarding from './Components/PatientOnboarding';
import DashboardPatient from './Components/DashboardPatient';
import { usePatientStore } from './store/usePatientStore';

// Protected Route Guard (For Logged-In Users Only)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Smart Public-Only Route Guard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const patient = usePatientStore((state) => state.patient);
  
  if (token) {
    // Directs onboarded patients to the main Dashboard hub, new users to onboarding
    const destination = patient ? "/dashboard" : "/onboarding";
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Public-Only Auth Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Patient Routes */}
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <PatientOnboarding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPatient />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient-profile" 
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy fallback redirect */}
        <Route path="/profile" element={<Navigate to="/patient-profile" replace />} />
        
        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}