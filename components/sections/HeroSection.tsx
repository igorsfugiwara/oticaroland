import React from 'react';
import { SiteConfig } from '../../types';
import { IMAGES } from '../../constants';

interface Props {
  siteConfig: SiteConfig;
}

export function HeroSection({ siteConfig }: Props) {
  return (
    <section id="inicio" className="relative h-[90vh] flex items-center overflow-hidden bg-navy">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={IMAGES.hero}
          className="w-full h-full object-cover opacity-40 animate-kenburns"
          alt="Ótica Roland Experience"
          //@ts-ignore
          fetchpriority="high"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="max-w-4xl">
          <span className="text-gold font-bold tracking-[0.5em] uppercase mb-8 block text-xs">
            Tradição Vila Mariana desde 2000
          </span>
          <h1 className="text-5xl md:text-8xl font-bold mb-10 leading-[1.05]">
            Refine o seu <br />
            <span className="text-gold italic font-serif">olhar.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-light max-w-2xl">
            {siteConfig.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-6">
            <a
              href="#produtos"
              className="group bg-gold text-navy px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
            >
              Coleção 2026
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Scroll</span>
        <div className="w-px h-12 bg-white"></div>
      </div>
    </section>
  );
}
