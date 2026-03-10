import React, { useMemo } from 'react';
import { Product } from '../../types';

interface Props {
  products: Product[];
}

export function TagManager({ products }: Props) {
  const tagStats = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => {
      if (p.active) {
        p.tags.forEach(tag => {
          map.set(tag, (map.get(tag) ?? 0) + 1);
        });
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
      <h3 className="text-2xl font-bold text-navy mb-2">Tags / Categorias</h3>
      <p className="text-slate-400 text-sm mb-8">
        Tags são gerenciadas diretamente nos produtos. Aqui você vê o panorama atual.
      </p>

      {tagStats.length === 0 ? (
        <p className="text-slate-400 italic text-sm">Nenhuma tag cadastrada ainda. Adicione tags nos produtos.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tagStats.map(([tag, count]) => (
            <div
              key={tag}
              className="flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-5 py-2.5"
            >
              <span className="text-sm font-bold text-navy uppercase tracking-wider">{tag}</span>
              <span className="text-[11px] bg-gold text-navy font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-slate-300 text-xs mt-8">
        * Apenas tags de produtos ativos aparecem como filtros no site público.
      </p>
    </div>
  );
}
