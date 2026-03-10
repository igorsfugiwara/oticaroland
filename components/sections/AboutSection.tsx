import React from 'react';
import { IMAGES } from '../../constants';

export function AboutSection() {
  return (
    <section id="sobre" className="py-40 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-3xl">
            <img
              src={IMAGES.story}
              alt="Walter Fugiwara - Ótica Roland"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              loading="lazy"
              width={600}
              height={600}
            />
          </div>
          <div className="absolute -bottom-10 -right-10 bg-gold p-12 rounded-[2.5rem] shadow-2xl text-navy max-w-xs hidden md:block">
            <p className="text-5xl font-serif font-bold mb-4">24y</p>
            <p className="text-xs uppercase font-bold tracking-widest leading-loose">
              De precisão técnica e compromisso familiar na Vila Mariana.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="inline-block px-4 py-1.5 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest rounded-lg">
            Tradição Walter Fugiwara
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-navy leading-tight">
            O rigor do laboratório, o{' '}
            <span className="text-gold italic">calor do atendimento.</span>
          </h2>
          <div className="space-y-6 text-lg text-slate-500 leading-relaxed font-light">
            <p>
              Cada par de lentes que sai da Ótica Roland passa pelo escrutínio técnico do Sr. Walter.
              Aqui, não vendemos apenas produtos; entregamos conforto visual sustentado por décadas de prática.
            </p>
            <p>
              Nossa herança na Vila Mariana é construída sobre a confiança de famílias que retornam geração após geração.
            </p>
          </div>
          <a
            href="#contato"
            className="inline-block text-navy font-bold text-sm uppercase tracking-widest border-b-2 border-gold pb-2 hover:text-gold transition-colors"
          >
            Conheça nossa oficina técnica
          </a>
        </div>
      </div>
    </section>
  );
}
