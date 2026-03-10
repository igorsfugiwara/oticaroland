import React from 'react';
import { SiteConfig } from '../types';

export const Header: React.FC<{ cartCount: number; onCartClick: () => void }> = ({ cartCount, onCartClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#inicio" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-lg shadow-xl transition-transform group-hover:rotate-12">
            R
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-[0.2em] text-sm md:text-base leading-none">ÓTICA ROLAND</span>
            <span className="text-gold text-[9px] uppercase tracking-[0.4em] mt-1 font-semibold opacity-80">Vila Mariana</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {[
            { label: 'Início', href: '#inicio' },
            { label: 'Produtos', href: '#produtos' },
            { label: 'História', href: '#sobre' },
            { label: 'Contato', href: '#contato' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-white/70 hover:text-gold text-xs uppercase tracking-widest font-bold transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        <button
          onClick={onCartClick}
          className="relative p-3 rounded-full text-white flex items-center justify-center group"
          aria-label="Ver carrinho"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-navy font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-navy">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export const Footer: React.FC<{ siteConfig: SiteConfig }> = ({ siteConfig }) => {
  const openSocial = (url: string) => window.open(url, '_blank');
  const whatsappMsg = encodeURIComponent('Olá senhor Walter, vim por meio do seu site');

  return (
    <footer className="bg-navy text-slate-400 py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-xl">R</div>
              <h3 className="text-white text-2xl font-bold tracking-widest">ÓTICA ROLAND</h3>
            </div>
            <p className="text-lg leading-relaxed max-w-md">
              A elegância do olhar através da técnica impecável do Sr. Walter Fugiwara. Há mais de duas décadas servindo com excelência.
            </p>
            <div className="flex gap-4">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all text-slate-400 hover:text-navy"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.302-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.003-1.375l-.36-.213-3.74.896.946-3.621-.234-.372A9.779 9.779 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm border-l-2 border-gold pl-4">Localização</h4>
            <p className="text-sm leading-loose opacity-80">{siteConfig.address}</p>
            <div className="mt-6 space-y-1">
              <p className="text-xs text-gold font-bold uppercase tracking-widest">Horários</p>
              <p className="text-sm">Seg - Sex: {siteConfig.workingHours.weekdays}</p>
              <p className="text-sm">Sáb: {siteConfig.workingHours.saturday}</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm border-l-2 border-gold pl-4">Coleções</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#produtos" className="hover:text-gold transition-colors">Óculos de Sol Premium</a></li>
              <li><a href="#produtos" className="hover:text-gold transition-colors">Lentes de Contato</a></li>
              <li><a href="#produtos" className="hover:text-gold transition-colors">Soluções Ópticas</a></li>
              <li><a href="#contato" className="hover:text-gold transition-colors">Consultoria Técnica</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 text-center md:text-left">
            © {new Date().getFullYear()} ÓTICA ROLAND • VILA MARIANA • SÃO PAULO
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
            Artesanalmente técnico.
          </p>
        </div>
      </div>
    </footer>
  );
};
