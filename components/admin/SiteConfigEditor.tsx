import React, { useState } from 'react';
import { SiteConfig } from '../../types';

interface Props {
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => void;
}

export function SiteConfigEditor({ config, onSave }: Props) {
  const [form, setForm] = useState<SiteConfig>({ ...config });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const setHours = (key: keyof SiteConfig['workingHours'], value: string) => {
    setForm(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [key]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all';

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 max-w-2xl">
      <h3 className="text-2xl font-bold text-navy mb-8">Configurações do Site</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Nome da Loja</label>
          <input className={inputCls} value={form.shopName} onChange={e => set('shopName', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">WhatsApp (somente números)</label>
          <input
            className={inputCls}
            value={form.whatsapp}
            onChange={e => set('whatsapp', e.target.value.replace(/\D/g, ''))}
            placeholder="5511999999999"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Endereço</label>
          <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Horário Seg-Sex</label>
            <input className={inputCls} value={form.workingHours.weekdays} onChange={e => setHours('weekdays', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Horário Sábado</label>
            <input className={inputCls} value={form.workingHours.saturday} onChange={e => setHours('saturday', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Título do Hero</label>
          <input className={inputCls} value={form.heroTitle} onChange={e => set('heroTitle', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Subtítulo do Hero</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.heroSubtitle}
            onChange={e => set('heroSubtitle', e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-navy text-white hover:bg-gold hover:text-navy'
          }`}
        >
          {saved ? 'Salvo ✓' : 'Salvar configurações'}
        </button>
      </form>
    </div>
  );
}
