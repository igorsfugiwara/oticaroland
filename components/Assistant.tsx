import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService, Message } from '../services/geminiService';
import { useCMS } from '../store/CMSContext';

const WELCOME = 'Olá! Sou o assistente da Ótica Roland. Como posso ajudar com suas lentes ou óculos hoje?';
const ERROR_MSG = 'Ops, tive um problema técnico. Tente novamente ou fale com o Sr. Walter pelo WhatsApp.';

type DisplayMsg = { role: 'user' | 'ai'; text: string };

export function Assistant() {
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
    if (now - lastSentAt.current < 2000) return; // rate limit: 1 msg / 2s
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
      setDisplayMessages(prev => [...prev, { role: 'ai', text: ERROR_MSG }]);
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
            {displayMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-4 px-5 rounded-[1.5rem] text-[13px] leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-navy text-white rounded-tr-none'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
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
