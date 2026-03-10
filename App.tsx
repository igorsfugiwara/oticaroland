import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { CMSProvider } from './store/CMSContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicSite } from './pages/PublicSite';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminShell } from './pages/admin/AdminShell';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <CMSProvider>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminShell />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CMSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
