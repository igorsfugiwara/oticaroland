import React, { useState, useRef } from 'react';
import { Product } from '../../types';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function ProductList({ products, onEdit, onDelete, onToggleActive, onReorder }: Props) {
  const sorted = [...products].sort((a, b) => a.order - b.order);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const dragIdx = useRef<number>(-1);

  const handleDragStart = (e: React.DragEvent, id: string, idx: number) => {
    setDragId(id);
    dragIdx.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    const ids = sorted.map(p => p.id);
    const fromIdx = ids.indexOf(dragId);
    const toIdx = ids.indexOf(targetId);
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, dragId);
    onReorder(ids);
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy">Produtos ({products.length})</h2>
        <p className="text-slate-400 text-xs">Arraste para reordenar</p>
      </div>

      {sorted.map((product, idx) => (
        <div
          key={product.id}
          draggable
          onDragStart={e => handleDragStart(e, product.id, idx)}
          onDragOver={e => handleDragOver(e, product.id)}
          onDrop={e => handleDrop(e, product.id)}
          onDragEnd={() => { setDragId(null); setOverId(null); }}
          className={`flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border transition-all cursor-grab active:cursor-grabbing ${
            overId === product.id ? 'border-gold/60 shadow-md scale-[1.01]' : 'border-slate-100'
          } ${!product.active ? 'opacity-50' : ''}`}
        >
          <div className="text-slate-300 select-none text-lg">⠿</div>

          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-navy truncate">{product.name}</p>
            <p className="text-gold font-bold text-sm">R$ {product.price.toFixed(2)}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
              product.quantity > 0 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {product.quantity > 0 ? `Estq: ${product.quantity}` : 'Sem estoque'}
            </span>

            <button
              onClick={() => onToggleActive(product.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                product.active
                  ? 'bg-navy text-white hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {product.active ? 'Ativo' : 'Inativo'}
            </button>

            <button
              onClick={() => onEdit(product)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title="Editar"
            >
              ✏️
            </button>

            <button
              onClick={() => {
                if (confirm(`Excluir "${product.name}"?`)) onDelete(product.id);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
              title="Excluir"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg font-serif italic">Nenhum produto cadastrado.</p>
        </div>
      )}
    </div>
  );
}
