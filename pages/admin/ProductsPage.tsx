import React, { useState } from 'react';
import { Product } from '../../types';
import { useCMS } from '../../store/CMSContext';
import { ProductList } from '../../components/admin/ProductList';
import { ProductEditor } from '../../components/admin/ProductEditor';
import { TagManager } from '../../components/admin/TagManager';

type ProductDraft = Omit<Product, 'id' | 'order'>;

export function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductActive, reorderProducts } = useCMS();
  const [editing, setEditing] = useState<Product | null | 'new'>(null);

  const handleSave = (draft: ProductDraft) => {
    if (editing === 'new') {
      addProduct(draft);
    } else if (editing) {
      updateProduct(editing.id, draft);
    }
    setEditing(null);
  };

  if (editing !== null) {
    return (
      <div>
        <button
          onClick={() => setEditing(null)}
          className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-navy transition-colors flex items-center gap-2"
        >
          ← Voltar à lista
        </button>
        <ProductEditor
          initial={editing === 'new' ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-navy">Produtos</h1>
        <button
          onClick={() => setEditing('new')}
          className="bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all"
        >
          + Novo produto
        </button>
      </div>

      <ProductList
        products={products}
        onEdit={p => setEditing(p)}
        onDelete={deleteProduct}
        onToggleActive={toggleProductActive}
        onReorder={reorderProducts}
      />

      <TagManager products={products} />
    </div>
  );
}
