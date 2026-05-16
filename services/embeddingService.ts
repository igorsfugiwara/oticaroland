import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY não encontrada.');
  if (!ai) ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai;
}

/**
 * Gera o texto de representação de um produto para embedding.
 * Quanto mais rico o texto, melhor a busca semântica.
 */
export function buildProductText(product: Product): string {
  return [
    product.name,
    product.description,
    product.tags.join(' '),
    `R$${product.price.toFixed(2)}`,
    product.isConsultative ? 'sob consulta' : 'disponível',
  ].join(' | ');
}

/**
 * Gera embedding de um texto usando o modelo text-embedding-004 do Gemini.
 * Retorna um array de números (vetor) que representa o significado semântico.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getClient();
  const response = await client.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  return response.embeddings[0].values;
}

/**
 * Calcula a similaridade cosine entre dois vetores.
 * Retorna valor entre -1 e 1.
 * Quanto mais próximo de 1, mais similares são os textos.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

/**
 * Encontra os produtos mais relevantes para uma pergunta do usuário.
 *
 * Como funciona:
 * 1. Gera embedding da pergunta
 * 2. Compara com embedding de cada produto usando cosine similarity
 * 3. Retorna os topK produtos com maior similaridade
 *
 * Se um produto não tiver embedding salvo, ele é incluído por segurança.
 */
export async function findRelevantProducts(
  userQuery: string,
  products: Product[],
  topK: number = 5
): Promise<Product[]> {
  const withEmbedding = products.filter(p => p.embedding && p.embedding.length > 0);
  const withoutEmbedding = products.filter(p => !p.embedding || p.embedding.length === 0);

  if (withEmbedding.length === 0) {
    console.warn('[EmbeddingService] Nenhum produto tem embedding. Retornando todos.');
    return products;
  }

  const queryEmbedding = await generateEmbedding(userQuery);

  const scored = withEmbedding.map(product => ({
    product,
    score: cosineSimilarity(queryEmbedding, product.embedding!),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topProducts = scored.slice(0, topK).map(s => s.product);

  console.log('[EmbeddingService] Scores de similaridade:');
  scored.slice(0, topK).forEach(s => {
    console.log(`  ${s.product.name}: ${s.score.toFixed(4)}`);
  });

  const safetyProducts = withoutEmbedding.slice(0, 2);

  return [...topProducts, ...safetyProducts];
}
