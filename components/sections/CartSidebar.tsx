import React from 'react';
import { CartItem } from '../../types';

interface Props {
  cart: CartItem[];
  cartTotal: number;
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export function CartSidebar({ cart, cartTotal, isOpen, onClose, onRemove, onUpdateQty, onCheckout }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-3xl animate-in flex flex-col overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-slate-100">
          <h3 className="text-2xl font-bold text-navy uppercase tracking-widest">Carrinho</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-2xl font-light"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <svg className="w-20 h-20 mb-6 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-xl font-serif italic">Seu carrinho está vazio</p>
              <button onClick={onClose} className="mt-8 text-gold font-bold text-xs uppercase tracking-widest hover:underline">
                Começar compras
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} loading="lazy" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-navy text-lg leading-tight pr-2">{item.name}</h4>
                    <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-400 flex-shrink-0">&times;</button>
                  </div>
                  <p className="text-gold font-bold text-sm mb-auto">R$ {item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-md transition-colors"
                      >-</button>
                      <span className="w-8 text-center text-sm font-bold">{item.cartQuantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-md transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total</span>
              <span className="text-3xl font-bold text-navy">
                R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-navy text-white py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs hover:bg-gold hover:text-navy transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95"
            >
              Confirmar no WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
