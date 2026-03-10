import React, { createContext, useContext, ReactNode } from 'react';
import { useCustomers } from '../hooks/useCustomers';

type CustomerStore = ReturnType<typeof useCustomers>;

const CustomerContext = createContext<CustomerStore | null>(null);

// CustomerProvider fica em AdminShell (não em App) porque é admin-only
export function CustomerProvider({ children }: { children: ReactNode }) {
  const store = useCustomers();
  return <CustomerContext.Provider value={store}>{children}</CustomerContext.Provider>;
}

export function useCustomerStore(): CustomerStore {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomerStore deve ser usado dentro de CustomerProvider');
  return ctx;
}
