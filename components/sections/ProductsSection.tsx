import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product } from '../../types';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onConsult: (product: Product) => void;
  whatsapp: string;
}

const MOBILE_INITIAL_COUNT = 3;

export function ProductsSection({ products, onAddToCart, onConsult, whatsapp }: Props) {
  const [activeTag, setActiveTag] = useState<string>('todos');
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tagsAtEnd, setTagsAtEnd] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

const TAG_ORDER = ['todos', 'solar', 'grau', 'lentes', 'infantil', 'acessorios'];

const allTags = useMemo(() => {
  const tags = new Set<string>();
  products.forEach(p => p.tags.forEach(t => tags.add(t)));
  return TAG_ORDER.filter(t => t === 'todos' || tags.has(t));
}, [products]);

  const filtered = activeTag === 'todos'
    ? products
    : products.filter(p => p.tags.includes(activeTag));

  // Reset "ver mais" whenever filter changes
  useEffect(() => {
    setShowAll(false);
  }, [activeTag]);

  const handleTagsScroll = () => {
    const el = tagsRef.current;
    if (!el) return;
    setTagsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  // Check on mount if already at end (few tags)
  useEffect(() => {
    handleTagsScroll();
  }, [allTags]);

  const visibleProducts = isMobile && !showAll ? filtered.slice(0, MOBILE_INITIAL_COUNT) : filtered;

  return (
    <section id="produtos" className="py-40 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold text-navy mb-8">
              Curadoria <br /><span className="text-gold font-serif italic">Premium</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Uma seleção rigorosa de acessórios ópticos que elevam a sua percepção visual e estilo pessoal.
            </p>
          </div>

          {/* Tags scroll com fade hint */}
          <div className="relative w-full md:w-auto">
            <div
              ref={tagsRef}
              onScroll={handleTagsScroll}
              className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0 scrollbar-hide"
            >
              {allTags.map(tag => (
                <button
                  key={tag === 'todos' ? 'Todos' : tag.replace(/-/g, ' ')}
                  onClick={() => setActiveTag(tag)}
                  className={`flex-shrink-0 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTag === tag
                      ? 'bg-navy text-white shadow-xl scale-105'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {tag === 'todos' ? 'Todos' : tag.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
            {/* Gradient fade — only on mobile, hides when scrolled to end */}
            <div
              className={`pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent transition-opacity duration-300 md:hidden ${tagsAtEnd ? 'opacity-0' : 'opacity-100'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-16">
          {visibleProducts.map(product => (
            <div
              key={product.id}
              className="group flex flex-col h-full bg-slate-50/30 rounded-[2.5rem] border border-transparent hover:border-slate-100 hover:bg-white transition-all duration-500 hover:shadow-3xl p-6"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-10 shadow-2xl">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                  width={400}
                  height={500}
                />
                {product.quantity === 0 && (
                  <div className="absolute top-4 left-4 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Sob consulta
                  </div>
                )}
                <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                  {product.quantity > 0 ? (
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-navy shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-75 hover:bg-gold hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => onConsult(product)}
                      className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-navy shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-75"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="px-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                    {product.tags[0] || 'Ótica'}
                  </span>
                  <span className="font-bold text-xl text-navy">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                  {product.description}
                </p>
                {product.quantity > 0 ? (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="mt-auto w-full border-2 border-navy/10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-navy hover:bg-navy hover:text-white hover:border-navy transition-all active:scale-95"
                  >
                    Comprar Agora
                  </button>
                ) : (
                  <button
                    onClick={() => onConsult(product)}
                    className="mt-auto w-full border-2 border-gold/40 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-navy transition-all active:scale-95"
                  >
                    Solicitar via WhatsApp
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ver mais — mobile only, when there are hidden products */}
        {!showAll && filtered.length > MOBILE_INITIAL_COUNT && (
          <div className="mt-12 flex justify-center md:hidden">
            <button
              onClick={() => setShowAll(true)}
              className="px-10 py-4 rounded-full border-2 border-navy/10 text-[10px] font-bold uppercase tracking-widest text-navy hover:bg-navy hover:text-white hover:border-navy transition-all active:scale-95"
            >
              Ver mais ({filtered.length - MOBILE_INITIAL_COUNT} produtos)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
