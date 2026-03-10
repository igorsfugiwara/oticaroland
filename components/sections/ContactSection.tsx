import React from 'react';

interface Props {
  whatsapp: string;
  address: string;
  workingHours: { weekdays: string; saturday: string };
}

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.621535456897!2d-46.6385311!3d-23.582046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a176e737197%3A0xc665780a6b98e727!2sAv.%20Domingos%20de%20Morais%2C%20138%20-%20Vila%20Mariana%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004010-000!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr';

export function ContactSection({ whatsapp, address, workingHours }: Props) {
  const defaultMsg = encodeURIComponent('Olá senhor Walter, vim por meio do seu site');
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${defaultMsg}`;

  return (
    <section id="contato" className="bg-navy relative overflow-hidden">
      {/* CTA block */}
      <div className="relative py-28 px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Precisa de ajuda <br />
            <span className="text-gold italic font-serif">especializada?</span>
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
            O Sr. Walter está à disposição para consultoria presencial ou via WhatsApp.
          </p>
          <button
            onClick={() => window.open(whatsappUrl, '_blank')}
            className="bg-gold text-navy px-14 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-sm hover:bg-white transition-all transform hover:scale-105 shadow-3xl active:scale-95"
          >
            Conversar com Sr. Walter
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mx-6" />

      {/* Map + Info block */}
      <div className="container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4">
              Nossa Localização
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Visite-nos na <br />
              <span className="text-gold font-serif italic">Vila Mariana</span>
            </h3>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Endereço</p>
                <p className="text-white font-medium leading-relaxed">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Horários</p>
                <p className="text-white font-medium">Seg – Sex: {workingHours.weekdays}</p>
                <p className="text-slate-400 text-sm">Sáb: {workingHours.saturday}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.302-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.003-1.375l-.36-.213-3.74.896.946-3.621-.234-.372A9.779 9.779 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">WhatsApp</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-gold transition-colors"
                >
                  +55 (11) 99879-3053
                </a>
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-gold/30 text-gold px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-navy transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.302-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.003-1.375l-.36-.213-3.74.896.946-3.621-.234-.372A9.779 9.779 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
            Abrir no WhatsApp
          </a>
        </div>

        {/* Map */}
        <div className="relative h-[420px] lg:h-[480px] rounded-[2rem] overflow-hidden shadow-3xl border-2 border-gold/20">
          <iframe
            src={MAP_EMBED}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Ótica Roland — Av. Domingos de Morais, 138, Vila Mariana"
          />
          {/* Overlay de canto com label */}
          <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl shadow-lg border border-gold/20 pointer-events-none">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Ótica Roland</p>
            <p className="text-xs text-white/80 mt-0.5">Vila Mariana, SP</p>
          </div>
        </div>
      </div>
    </section>
  );
}
