import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductsPage } from './ProductsPage';
import { ConfigPage } from './ConfigPage';
import { useAuth } from '../../store/AuthContext';

export function AdminShell() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    document.title = 'Admin — Ótica Roland';
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route index element={<Navigate to="produtos" replace />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="configuracoes" element={<ConfigPage />} />
      </Routes>
    </AdminLayout>
  );
}
