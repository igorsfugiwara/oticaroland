import React from 'react';
import { useCustomerStore } from '../../store/CustomerContext';
import { useCMS } from '../../store/CMSContext';

function formatBirthdate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

export function DashboardPage() {
  const { customers, birthdaysThisWeek, isLoading } = useCustomerStore();
  const { products } = useCMS();

  const activeProducts = products.filter(p => p.active).length;
  const activeCustomers = customers.filter(c => c.active).length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Visão geral da Ótica Roland</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Clientes ativos
          </p>
          <p className="text-4xl font-bold text-navy">{activeCustomers}</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Produtos ativos
          </p>
          <p className="text-4xl font-bold text-navy">{activeProducts}</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Aniversários esta semana
          </p>
          <p className="text-4xl font-bold text-gold">{birthdaysThisWeek.length}</p>
        </div>
      </div>

      {/* Card de aniversários */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
          <span className="text-xl">🎂</span>
          <h2 className="text-base font-bold text-navy uppercase tracking-widest">
            Aniversários esta semana
          </h2>
        </div>

        {isLoading ? (
          <div className="px-8 py-10 text-center text-slate-400 text-sm">Carregando...</div>
        ) : birthdaysThisWeek.length === 0 ? (
          <div className="px-8 py-10 text-center">
            <p className="text-slate-400 font-serif italic">
              Nenhum aniversariante nos próximos 7 dias.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {birthdaysThisWeek.map(c => {
              const waMsg = encodeURIComponent(
                `Olá ${c.name}, a equipe da Ótica Roland deseja um feliz aniversário! 🎂`
              );
              const waUrl = `https://wa.me/55${c.phone.replace(/\D/g, '')}?text=${waMsg}`;
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between px-8 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-navy font-bold text-base flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">{c.name}</p>
                      <p className="text-xs text-gold font-bold">
                        🎂 {c.birthdate ? formatBirthdate(c.birthdate) : '—'}
                      </p>
                    </div>
                  </div>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.302-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.003-1.375l-.36-.213-3.74.896.946-3.621-.234-.372A9.779 9.779 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                    Parabenizar
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
