import React, { useState, KeyboardEvent } from 'react';
import { Product } from '../../types';

type ProductDraft = Omit<Product, 'id' | 'order'>;

interface Props {
  initial?: Product | null;
  onSave: (data: ProductDraft) => void;
  onCancel: () => void;
}

const empty: ProductDraft = {
  name: '',
  price: 0,
  description: '',
  quantity: 0,
  imageUrl: '',
  isConsultative: false,
  active: true,
  tags: [],
};

export function ProductEditor({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<ProductDraft>(
    initial ? { ...initial } : { ...empty }
  );
  const [tagInput, setTagInput] = useState('');

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      set('tags', [...form.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    set('tags', form.tags.filter(t => t !== tag));
  };

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all';

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-navy mb-8">
        {initial ? 'Editar Produto' : 'Novo Produto'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Nome *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={e => set('name', e.target.value)}
            required
            maxLength={120}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Preço (R$) *</label>
            <input
              type="number"
              min={0}
              step={0.01}
              className={inputCls}
              value={form.price}
              onChange={e => set('price', parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Quantidade em estoque</label>
            <input
              type="number"
              min={0}
              className={inputCls}
              value={form.quantity}
              onChange={e => set('quantity', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Descrição</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">URL da Imagem</label>
          <input
            type="url"
            className={inputCls}
            value={form.imageUrl}
            onChange={e => set('imageUrl', e.target.value)}
            placeholder="https://... ou /assets/..."
          />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="mt-3 h-24 w-24 object-cover rounded-xl border border-slate-100" />
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tags (Enter para adicionar)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-navy/10 text-navy text-[11px] font-bold uppercase px-3 py-1.5 rounded-full">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1 leading-none">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              placeholder="solar, masculino, premium..."
            />
            <button type="button" onClick={addTag} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm transition-colors">
              +
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isConsultative}
              onChange={e => set('isConsultative', e.target.checked)}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-sm font-medium text-navy">Produto consultivo (sem compra direta)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => set('active', e.target.checked)}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-sm font-medium text-navy">Ativo na loja</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-navy text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all"
          >
            {initial ? 'Salvar alterações' : 'Criar produto'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
