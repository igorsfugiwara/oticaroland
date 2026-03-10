import React, { useState } from 'react';
import { Customer } from '../../types';
import { useCustomerStore } from '../../store/CustomerContext';
import { CustomerList } from './customers/CustomerList';
import { CustomerEditor } from './customers/CustomerEditor';

type View = 'list' | 'new' | Customer;

export function CustomersPage() {
  const {
    customers,
    birthdaysThisWeek,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleActive,
  } = useCustomerStore();

  const [view, setView] = useState<View>('list');

  const handleSave = async (draft: Omit<Customer, 'id' | 'createdAt'>) => {
    if (view === 'new') {
      await addCustomer(draft);
    } else if (view !== 'list') {
      await updateCustomer(view.id, draft);
    }
    setView('list');
  };

  if (view !== 'list') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-navy transition-colors flex items-center gap-2"
        >
          ← Voltar à lista
        </button>
        <CustomerEditor
          initial={view === 'new' ? null : view}
          onSave={handleSave}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  return (
    <CustomerList
      customers={customers}
      birthdaysThisWeek={birthdaysThisWeek}
      onNew={() => setView('new')}
      onEdit={c => setView(c)}
      onToggleActive={toggleActive}
      onDelete={deleteCustomer}
    />
  );
}
