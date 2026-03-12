import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService, Message } from '../services/geminiService';
import { useCMS } from '../store/CMSContext';
import { Product } from '../types';
import { SHOP_INFO } from '../constants';

const WELCOME = 'Olá! Sou o assistente da Ótica Roland. Como posso ajudar com suas lentes ou óculos hoje?';
const ERROR_SENTINEL = '__ERROR_WHATSAPP__';

type DisplayMsg = { role: 'user' | 'ai'; text: string };

interface AssistantProps {
  onAddToCart?: (product: Product) => void;
}

// Detecta se a resposta menciona algum produto do catálogo
function detectMentionedProduct(text: string, products: Product[]): Product | null {
  const lower = text.toLowerCase();
  return products.find(p => lower.includes(p.name.toLowerCase())) ?? null;
}

export function Assistant({ onAddToCart }: AssistantProps) {
  const { activeProducts } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<DisplayMsg[]>([
    { role: 'ai', text: WELCOME },
  ]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const lastSentAt = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const handleSend = useCallback(async () => {
    const now = Date.now();
    if (!input.trim() || isLoading) return;
    if (now - lastSentAt.current < 2000) return;
    lastSentAt.current = now;

    const userText = input.trim().slice(0, 500);
    setInput('');
    setDisplayMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await geminiService.getResponse({
        userMessage: userText,
        products: activeProducts,
        history: history.slice(-10),
      });

      setHistory(prev => [
        ...prev,
        { role: 'user', text: userText },
        { role: 'assistant', text: response },
      ]);
      setDisplayMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch {
      setDisplayMessages(prev => [...prev, { role: 'ai', text: ERROR_SENTINEL }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, history, activeProducts]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {isOpen ? (
        <div className="bg-white w-[90vw] md:w-96 h-[550px] rounded-[2.5rem] shadow-3xl border border-slate-200 flex flex-col overflow-hidden border-t-4 border-t-gold">
          <div className="bg-navy p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-base shadow-lg shrink-0">R</div>
              <div>
                <p className="font-bold text-base tracking-tight leading-none mb-1">Ótica Roland</p>
                <p className="text-[10px] text-gold/90 font-bold uppercase tracking-widest">Atendimento Digital</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gold transition-colors text-3xl font-light">&times;</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
            {displayMessages.map((m, i) => {
              // Mensagem de erro com botão WhatsApp
              if (m.text === ERROR_SENTINEL) {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none p-4 max-w-[85%] shadow-sm">
                      <p className="text-[13px] text-slate-600 mb-3">
                        Ops, tive um problema técnico. Mas o Sr. Walter pode te ajudar agora!
                      </p>
                      <a
                        href={`https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent('Olá, preciso de ajuda')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-600 transition-colors w-fit"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.722.886.926-3.617-.235-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                        </svg>
                        Falar com Sr. Walter
                      </a>
                    </div>
                  </div>
                );
              }

              // Mensagem normal
              const mentionedProduct = m.role === 'ai'
                ? detectMentionedProduct(m.text, activeProducts)
                : null;

              return (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-4 px-5 rounded-[1.5rem] text-[13px] leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-navy text-white rounded-tr-none'
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Mini card do produto mencionado */}
                  {mentionedProduct && (
                    <div className="mt-2 bg-white border border-slate-100 rounded-2xl p-3 flex gap-3 items-center max-w-[85%] shadow-sm">
                      <img
                        src={mentionedProduct.imageUrl}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        alt={mentionedProduct.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-navy truncate">{mentionedProduct.name}</p>
                        <p className="text-xs text-gold font-bold mt-0.5">
                          R$ {mentionedProduct.price.toFixed(2)}
                        </p>
                      </div>
                      {onAddToCart && (
                        <button
                          onClick={() => onAddToCart(mentionedProduct)}
                          className="bg-navy text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-gold hover:text-navy transition-all shrink-0"
                        >
                          + Carrinho
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 px-6 rounded-full animate-pulse text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Processando...
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t bg-white flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              maxLength={500}
              className="flex-1 bg-slate-100 px-6 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-navy text-white p-4 rounded-2xl hover:bg-gold hover:text-navy transition-all shadow-xl active:scale-95 shrink-0 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-navy text-white h-16 px-6 rounded-full shadow-3xl hover:bg-gold hover:text-navy transition-all group border-2 border-gold/50 flex items-center gap-4 active:scale-95"
        >
          <span className="hidden md:inline-block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold uppercase text-[11px] tracking-[0.2em]">
            Consultor Técnico
          </span>
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-gold/40 rounded-full"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}