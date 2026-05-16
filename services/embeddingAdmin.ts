import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { generateEmbedding, buildProductText } from './embeddingService';

/**
 * Gera embedding de um produto e salva no Firestore.
 * Deve ser chamado quando um produto é criado ou seu nome/descrição/tags mudam.
 */
export async function generateAndSaveProductEmbedding(
  product: Product
): Promise<number[]> {
  const text = buildProductText(product);
  console.log(`[EmbeddingAdmin] Gerando embedding para: ${product.name}`);

  const embedding = await generateEmbedding(text);

  await updateDoc(doc(db, 'products', product.id), { embedding });

  console.log(`[EmbeddingAdmin] Embedding salvo para: ${product.name} (${embedding.length} dimensões)`);
  return embedding;
}

/**
 * Gera embeddings para todos os produtos de uma vez.
 * Use no admin para fazer a migração inicial.
 * Processa um por vez para não estourar rate limit da API.
 */
export async function generateEmbeddingsForAllProducts(
  products: Product[],
  onProgress?: (current: number, total: number, productName: string) => void
): Promise<void> {
  const total = products.length;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      onProgress?.(i + 1, total, product.name);
      await generateAndSaveProductEmbedding(product);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`[EmbeddingAdmin] Erro ao gerar embedding para ${product.name}:`, error);
    }
  }
}
