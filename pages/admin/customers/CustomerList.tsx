import React, { useState } from 'react';
import { Customer } from '../../../types';

interface Props {
  customers: Customer[];
  birthdaysThisWeek: Customer[];
  onNew: () => void;
  onEdit: (customer: Customer) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function nextBirthdayLabel(birthdate: string): string {
  const birth = new Date(birthdate + 'T12:00:00');
  return `${String(birth.getDate()).padStart(2, '0')}/${String(birth.getMonth() + 1).padStart(2, '0')}`;
}

export function CustomerList({
  customers,
  birthdaysThisWeek,
  onNew,
  onEdit,
  onToggleActive,
  onDelete,
}: Props) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );
  });

  const birthdayIds = new Set(birthdaysThisWeek.map(c => c.id));

  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Clientes</h1>
          <p className="text-slate-400 text-sm mt-1">{customers.length} cadastrados</p>
        </div>
        <button
          onClick={onNew}
          className="bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all flex-shrink-0"
        >
          + Novo cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
          {['Nome', 'Telefone', 'E-mail', 'Última visita', 'Aniversário', ''].map(h => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {h}
            </span>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-serif italic text-lg">
              {search ? 'Nenhum resultado.' : 'Nenhum cliente cadastrado.'}
            </p>
          </div>
        ) : (
          sorted.map(c => {
            const hasBirthday = birthdayIds.has(c.id);
            return (
              <div
                key={c.id}
                className={`grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-slate-50 items-center transition-colors hover:bg-slate-50/50 ${
                  !c.active ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-navy text-sm truncate">{c.name}</span>
                  {hasBirthday && (
                    <span title="Aniversário esta semana!" className="flex-shrink-0">🎂</span>
                  )}
                </div>
                <span className="text-sm text-slate-600">{formatPhone(c.phone)}</span>
                <span className="text-sm text-slate-500 truncate">{c.email || '—'}</span>
                <span className="text-sm text-slate-500">{c.lastVisit ? formatDate(c.lastVisit) : '—'}</span>
                <span className={`text-sm font-medium ${hasBirthday ? 'text-gold font-bold' : 'text-slate-500'}`}>
                  {c.birthdate ? nextBirthdayLabel(c.birthdate) : '—'}
                </span>

                <div className="flex items-center gap-1 justify-end">
                  <button
                    onClick={() => onEdit(c)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onToggleActive(c.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      c.active
                        ? 'bg-navy text-white hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {c.active ? 'Ativo' : 'Inativo'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir "${c.name}"? Esta ação não pode ser desfeita.`))
                        onDelete(c.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
