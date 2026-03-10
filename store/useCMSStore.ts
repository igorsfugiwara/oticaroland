import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, SiteConfig } from '../types';
import { DEFAULT_PRODUCTS, SHOP_INFO } from '../constants';

// ─── Helpers de inicialização ───────────────────────────────────────────────

async function seedProducts() {
  const batch = writeBatch(db);
  DEFAULT_PRODUCTS.forEach(p => {
    batch.set(doc(db, 'products', p.id), p);
  });
  await batch.commit();
}

async function seedConfig() {
  await setDoc(doc(db, 'settings', 'site'), SHOP_INFO);
}

// ─── Hook principal ──────────────────────────────────────────────────────────

export function useCMSStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(SHOP_INFO);
  const [isLoading, setIsLoading] = useState(true);

  // Escuta produtos em tempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), snap => {
      if (snap.empty) {
        seedProducts();
      } else {
        setProducts(snap.docs.map(d => d.data() as Product));
      }
    });
    return unsub;
  }, []);

  // Escuta config em tempo real
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site'), snap => {
      if (!snap.exists()) {
        seedConfig();
      } else {
        setSiteConfig(snap.data() as SiteConfig);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const activeProducts = [...products]
    .filter(p => p.active)
    .sort((a, b) => a.order - b.order);

  // ─── Ações ───────────────────────────────────────────────────────────────

  const addProduct = async (product: Omit<Product, 'id' | 'order'>) => {
    const id = `product-${Date.now()}`;
    const newProduct: Product = { ...product, id, order: products.length };
    await setDoc(doc(db, 'products', id), newProduct);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), updates as Record<string, unknown>);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const toggleProductActive = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    await updateDoc(doc(db, 'products', id), { active: !product.active });
  };

  const reorderProducts = async (orderedIds: string[]) => {
    const batch = writeBatch(db);
    orderedIds.forEach((id, idx) => {
      batch.update(doc(db, 'products', id), { order: idx });
    });
    await batch.commit();
  };

  const updateSiteConfig = async (updates: Partial<SiteConfig>) => {
    await updateDoc(doc(db, 'settings', 'site'), updates as Record<string, unknown>);
  };

  return {
    products,
    activeProducts,
    siteConfig,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    reorderProducts,
    updateSiteConfig,
  };
}
