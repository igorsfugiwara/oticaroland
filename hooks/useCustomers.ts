import { useState, useEffect } from 'react';
import {
  subscribeCustomers,
  addCustomer as svcAdd,
  updateCustomer as svcUpdate,
  deleteCustomer as svcDelete,
} from '../services/customerService';
import { Customer, Prescription } from '../types';

function hasBirthdayInNextDays(birthdate: string, days: number): boolean {
  const today = new Date();
  const birth = new Date(birthdate + 'T12:00:00');
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (birth.getMonth() === d.getMonth() && birth.getDate() === d.getDate()) return true;
  }
  return false;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeCustomers(data => {
      setCustomers(data);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const activeCustomers = customers.filter(c => c.active);

  const birthdaysThisWeek = customers.filter(
    c => c.birthdate && hasBirthdayInNextDays(c.birthdate, 7)
  );

  // ─── CRUD clientes ──────────────────────────────────────────────────────

  const addCustomer = (data: Omit<Customer, 'id' | 'createdAt'>) => svcAdd(data);

  const updateCustomer = (id: string, updates: Partial<Customer>) => svcUpdate(id, updates);

  const deleteCustomer = (id: string) => svcDelete(id);

  const toggleActive = async (id: string) => {
    const c = customers.find(c => c.id === id);
    if (!c) return;
    await svcUpdate(id, { active: !c.active });
  };

  // ─── CRUD receitas (inline no documento do cliente) ─────────────────────

  const addPrescription = async (
    customerId: string,
    data: Omit<Prescription, 'id' | 'createdAt'>
  ) => {
    const c = customers.find(c => c.id === customerId);
    if (!c) return;
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await svcUpdate(customerId, { prescriptions: [...c.prescriptions, newRx] });
  };

  const updatePrescription = async (
    customerId: string,
    prescriptionId: string,
    updates: Partial<Omit<Prescription, 'id' | 'createdAt'>>
  ) => {
    const c = customers.find(c => c.id === customerId);
    if (!c) return;
    await svcUpdate(customerId, {
      prescriptions: c.prescriptions.map(rx =>
        rx.id === prescriptionId ? { ...rx, ...updates } : rx
      ),
    });
  };

  const deletePrescription = async (customerId: string, prescriptionId: string) => {
    const c = customers.find(c => c.id === customerId);
    if (!c) return;
    await svcUpdate(customerId, {
      prescriptions: c.prescriptions.filter(rx => rx.id !== prescriptionId),
    });
  };

  return {
    customers,
    activeCustomers,
    birthdaysThisWeek,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleActive,
    addPrescription,
    updatePrescription,
    deletePrescription,
  };
}
