import React, { createContext, useContext, ReactNode } from 'react';
import { useCMSStore } from './useCMSStore';

type CMSStore = ReturnType<typeof useCMSStore>;

const CMSContext = createContext<CMSStore | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const store = useCMSStore();
  return <CMSContext.Provider value={store}>{children}</CMSContext.Provider>;
}

export function useCMS(): CMSStore {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used inside CMSProvider');
  return ctx;
}
