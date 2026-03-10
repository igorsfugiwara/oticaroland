import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { CustomerProvider } from '../../store/CustomerContext';
import { ProductsPage } from './ProductsPage';
import { ConfigPage } from './ConfigPage';
import { CustomersPage } from './CustomersPage';
import { DashboardPage } from './DashboardPage';
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
    <CustomerProvider>
      <AdminLayout onLogout={handleLogout}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="produtos" element={<ProductsPage />} />
          <Route path="clientes" element={<CustomersPage />} />
          <Route path="configuracoes" element={<ConfigPage />} />
        </Routes>
      </AdminLayout>
    </CustomerProvider>
  );
}
