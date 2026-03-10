import React, { useState } from 'react';
import { Prescription, EyePrescription } from '../../types';

type RxDraft = Omit<Prescription, 'id' | 'createdAt'>;

interface Props {
  initial: Prescription | null;
  onSave: (data: RxDraft) => void;
  onCancel: () => void;
}

const emptyEye: EyePrescription = { spherical: 0, cylindrical: 0, axis: 0, dnp: 32 };

const emptyRx: RxDraft = {
  date: new Date().toISOString().split('T')[0],
  doctor: '',
  doctorCRM: '',
  od: { ...emptyEye },
  oe: { ...emptyEye },
  addition: undefined,
  notes: '',
};

const inputCls =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all';

const numInput = (
  value: number,
  onChange: (v: number) => void,
  opts: { min: number; max: number; step: number }
) => (
  <input
    type="number"
    min={opts.min}
    max={opts.max}
    step={opts.step}
    className={inputCls}
    value={value}
    onChange={e => onChange(parseFloat(e.target.value) || 0)}
  />
);

export function PrescriptionForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<RxDraft>(
    initial
      ? { date: initial.date, doctor: initial.doctor, doctorCRM: initial.doctorCRM,
          od: { ...initial.od }, oe: { ...initial.oe },
          addition: initial.addition, notes: initial.notes }
      : { ...emptyRx, od: { ...emptyEye }, oe: { ...emptyEye } }
  );

  const setEye = (eye: 'od' | 'oe', field: keyof EyePrescription, value: number) =>
    setForm(prev => ({ ...prev, [eye]: { ...prev[eye], [field]: value } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctor.trim() || !form.date) return;
    onSave(form);
  };

  const eyeField = (
    eye: 'od' | 'oe',
    field: keyof EyePrescription,
    opts: { min: number; max: number; step: number }
  ) => numInput(form[eye][field], v => setEye(eye, field, v), opts);

  const rowLabel = 'text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center';
  const colLabel = 'text-xs font-bold uppercase tracking-widest text-white text-center py-2 px-3';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cabeçalho OD | OE */}
      <div className="grid grid-cols-[120px_1fr_1fr] gap-3 items-center">
        <div />
        <div className={`${colLabel} bg-navy rounded-xl`}>OD — Olho Direito</div>
        <div className={`${colLabel} bg-navy/70 rounded-xl`}>OE — Olho Esquerdo</div>
      </div>

      {/* Linhas OD/OE */}
      {(
        [
          { label: 'Esférico', field: 'spherical', min: -20, max: 20, step: 0.25 },
          { label: 'Cilíndrico', field: 'cylindrical', min: -20, max: 20, step: 0.25 },
          { label: 'Eixo', field: 'axis', min: 0, max: 180, step: 1 },
          { label: 'D.N.P (mm)', field: 'dnp', min: 25, max: 40, step: 0.5 },
        ] as { label: string; field: keyof EyePrescription; min: number; max: number; step: number }[]
      ).map(row => (
        <div key={row.field} className="grid grid-cols-[120px_1fr_1fr] gap-3 items-center">
          <label className={rowLabel}>{row.label}</label>
          {eyeField('od', row.field, { min: row.min, max: row.max, step: row.step })}
          {eyeField('oe', row.field, { min: row.min, max: row.max, step: row.step })}
        </div>
      ))}

      {/* Adição */}
      <div className="grid grid-cols-[120px_1fr_1fr] gap-3 items-center">
        <label className={rowLabel}>Adição</label>
        <div className="col-span-2">
          <input
            type="number"
            min={0}
            max={4}
            step={0.25}
            className={inputCls}
            placeholder="Opcional — para progressivo"
            value={form.addition ?? ''}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                addition: e.target.value === '' ? undefined : parseFloat(e.target.value),
              }))
            }
          />
        </div>
      </div>

      {/* Dados do médico + data */}
      <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Data da Receita *
          </label>
          <input
            type="date"
            className={inputCls}
            value={form.date}
            onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Médico *
          </label>
          <input
            className={inputCls}
            value={form.doctor}
            onChange={e => setForm(prev => ({ ...prev, doctor: e.target.value }))}
            required
            placeholder="Dr. Nome Sobrenome"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            CRM
          </label>
          <input
            className={inputCls}
            value={form.doctorCRM}
            onChange={e => setForm(prev => ({ ...prev, doctorCRM: e.target.value }))}
            placeholder="SP-123456"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Observações
        </label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={2}
          value={form.notes ?? ''}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Prism, lentes especiais, etc."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-navy text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all"
        >
          {initial ? 'Salvar alterações' : 'Adicionar receita'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
