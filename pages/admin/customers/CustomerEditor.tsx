import React, { useState } from 'react';
import { Customer, Prescription } from '../../../types';
import { PrescriptionForm } from '../../../components/admin/PrescriptionForm';

type CustomerDraft = Omit<Customer, 'id' | 'createdAt'>;
type Tab = 'dados' | 'endereco' | 'receitas';
type RxEdit = { rx: Prescription | null; index: number | null }; // null index = new

interface Props {
  initial: Customer | null;
  onSave: (draft: CustomerDraft) => void;
  onCancel: () => void;
}

const emptyAddress = {
  street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '',
};

const emptyDraft: CustomerDraft = {
  name: '', email: '', phone: '', birthdate: '',
  address: { ...emptyAddress },
  prescriptions: [],
  lastVisit: '', notes: '', active: true,
};

// ── Phone helpers ──────────────────────────────────────────────────────────

function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length === 0 ? '' : `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const mid = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, mid)}-${d.slice(mid)}`;
}

function stripPhone(masked: string): string {
  return masked.replace(/\D/g, '');
}

// ── CEP lookup ─────────────────────────────────────────────────────────────

async function fetchCep(cep: string): Promise<Partial<CustomerDraft['address']> | null> {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      zipCode: digits,
    };
  } catch {
    return null;
  }
}

// ── Constants ──────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all';

function formatRxDate(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function eyeShort(rx: Prescription): string {
  const fmt = (n: number) => (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2));
  return `OD ${fmt(rx.od.spherical)} / OE ${fmt(rx.oe.spherical)}`;
}

// ── Component ──────────────────────────────────────────────────────────────

export function CustomerEditor({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<CustomerDraft>(
    initial
      ? {
          name: initial.name, email: initial.email,
          phone: maskPhone(initial.phone),
          birthdate: initial.birthdate,
          address: { ...emptyAddress, ...initial.address },
          prescriptions: [...initial.prescriptions],
          lastVisit: initial.lastVisit || '',
          notes: initial.notes || '',
          active: initial.active,
        }
      : { ...emptyDraft, address: { ...emptyAddress } }
  );

  const [tab, setTab] = useState<Tab>('dados');
  const [rxEdit, setRxEdit] = useState<RxEdit | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const set = <K extends keyof CustomerDraft>(key: K, value: CustomerDraft[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const setAddr = (field: keyof CustomerDraft['address'], value: string) =>
    setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));

  const handleCepChange = async (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    const masked = digits.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    setAddr('zipCode', masked);
    setCepError('');
    if (digits.length === 8) {
      setCepLoading(true);
      const result = await fetchCep(digits);
      setCepLoading(false);
      if (result) {
        setForm(prev => ({ ...prev, address: { ...prev.address, ...result } }));
      } else {
        setCepError('CEP não encontrado.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, phone: stripPhone(form.phone) });
  };

  // ── Receitas ─────────────────────────────────────────────────────────────

  const handleRxSave = (data: Omit<Prescription, 'id' | 'createdAt'>) => {
    if (!rxEdit) return;
    if (rxEdit.index === null) {
      // new
      const newRx: Prescription = {
        ...data,
        id: `rx-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      set('prescriptions', [...form.prescriptions, newRx]);
    } else {
      // edit existing (local only until final save)
      const updated = form.prescriptions.map((rx, i) =>
        i === rxEdit.index ? { ...rx, ...data } : rx
      );
      set('prescriptions', updated);
    }
    setRxEdit(null);
  };

  const handleRxDelete = (index: number) => {
    if (!confirm('Excluir esta receita?')) return;
    set('prescriptions', form.prescriptions.filter((_, i) => i !== index));
  };

  // ── Tabs UI ───────────────────────────────────────────────────────────────

  const TABS: { key: Tab; label: string }[] = [
    { key: 'dados', label: 'Dados Pessoais' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'receitas', label: `Receitas (${form.prescriptions.length})` },
  ];

  const tabBtn = (t: Tab, label: string) => (
    <button
      key={t}
      type="button"
      onClick={() => { setRxEdit(null); setTab(t); }}
      className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
        tab === t ? 'bg-navy text-white' : 'text-slate-500 hover:text-navy'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-navy mb-6">
        {initial ? 'Editar Cliente' : 'Novo Cliente'}
      </h3>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-xl w-fit">
        {TABS.map(t => tabBtn(t.key, t.label))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Aba 1: Dados Pessoais ────────────────────────────────────── */}
        {tab === 'dados' && (
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Nome Completo *
              </label>
              <input
                className={inputCls}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                maxLength={120}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  className={inputCls}
                  value={form.phone}
                  onChange={e => set('phone', maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.birthdate}
                  onChange={e => set('birthdate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Última Visita
                </label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.lastVisit || ''}
                  onChange={e => set('lastVisit', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Notas Internas
              </label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.notes || ''}
                onChange={e => set('notes', e.target.value)}
                placeholder="Preferências, histórico relevante..."
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => set('active', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm font-medium text-navy">Cliente ativo</span>
            </label>
          </div>
        )}

        {/* ── Aba 2: Endereço ────────────────────────────────────────────── */}
        {tab === 'endereco' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  CEP
                </label>
                <div className="relative">
                  <input
                    className={inputCls}
                    value={form.address.zipCode}
                    onChange={e => handleCepChange(e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {cepLoading && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold font-bold">
                      Buscando...
                    </span>
                  )}
                </div>
                {cepError && <p className="text-red-400 text-xs mt-1">{cepError}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Estado
                </label>
                <input
                  className={inputCls}
                  value={form.address.state}
                  onChange={e => setAddr('state', e.target.value)}
                  maxLength={2}
                  placeholder="SP"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Rua / Logradouro
              </label>
              <input
                className={inputCls}
                value={form.address.street}
                onChange={e => setAddr('street', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Número
                </label>
                <input
                  className={inputCls}
                  value={form.address.number}
                  onChange={e => setAddr('number', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Complemento
                </label>
                <input
                  className={inputCls}
                  value={form.address.complement || ''}
                  onChange={e => setAddr('complement', e.target.value)}
                  placeholder="Apto, bloco..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Bairro
                </label>
                <input
                  className={inputCls}
                  value={form.address.neighborhood}
                  onChange={e => setAddr('neighborhood', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Cidade
                </label>
                <input
                  className={inputCls}
                  value={form.address.city}
                  onChange={e => setAddr('city', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Aba 3: Receitas ───────────────────────────────────────────── */}
        {tab === 'receitas' && (
          <div className="space-y-4">
            {rxEdit ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {rxEdit.index === null ? 'Nova receita' : 'Editar receita'}
                </p>
                <PrescriptionForm
                  initial={rxEdit.rx}
                  onSave={handleRxSave}
                  onCancel={() => setRxEdit(null)}
                />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">
                    {form.prescriptions.length === 0
                      ? 'Nenhuma receita cadastrada.'
                      : `${form.prescriptions.length} receita(s)`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRxEdit({ rx: null, index: null })}
                    className="text-xs font-bold uppercase tracking-widest text-gold hover:text-navy border border-gold/30 hover:border-navy px-4 py-2 rounded-lg transition-all"
                  >
                    + Nova receita
                  </button>
                </div>

                {[...form.prescriptions]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((rx, i) => {
                    const origIndex = form.prescriptions.indexOf(rx);
                    return (
                      <div
                        key={rx.id}
                        className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold text-navy">
                              {formatRxDate(rx.date)}
                            </span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                              {rx.doctor}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono">{eyeShort(rx)}</p>
                          {rx.addition !== undefined && (
                            <p className="text-xs text-slate-400">Adição: +{rx.addition.toFixed(2)}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setRxEdit({ rx, index: origIndex })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 transition-colors"
                            title="Editar receita"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRxDelete(origIndex)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                            title="Excluir receita"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        )}

        {/* ── Botões de ação (só nas abas de dados/endereço) ──────────── */}
        {tab !== 'receitas' && (
          <div className="flex gap-4 pt-8 border-t border-slate-100 mt-8">
            <button
              type="submit"
              className="flex-1 bg-navy text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all"
            >
              {initial ? 'Salvar alterações' : 'Cadastrar cliente'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        )}

        {tab === 'receitas' && !rxEdit && (
          <div className="flex gap-4 pt-8 border-t border-slate-100 mt-8">
            <button
              type="submit"
              className="flex-1 bg-navy text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all"
            >
              {initial ? 'Salvar alterações' : 'Cadastrar cliente'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
