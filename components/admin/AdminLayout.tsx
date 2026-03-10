import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
  onLogout: () => void;
}

export function AdminLayout({ children, onLogout }: Props) {
  const { pathname } = useLocation();

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/produtos', label: 'Produtos' },
    { to: '/admin/clientes', label: 'Clientes' },
    { to: '/admin/configuracoes', label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-base">R</div>
          <span className="font-bold tracking-widest text-sm uppercase">Ótica Roland — Admin</span>
        </div>
        <nav className="flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname.startsWith(link.to) ? 'text-gold' : 'text-white/70 hover:text-gold'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors border-l border-white/20 pl-6"
          >
            Ver site ↗
          </a>
          <button
            onClick={onLogout}
            className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors border-l border-white/20 pl-6"
          >
            Sair
          </button>
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
