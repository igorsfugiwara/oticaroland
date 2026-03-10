import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

function buildProductContext(products: Product[]): string {
  if (!products.length) return 'Nenhum produto disponível no momento.';
  return products
    .map(
      p =>
        `- ${p.name}: R$${p.price.toFixed(2)} | Tags: ${p.tags.join(', ')} | ${p.description} | Estoque: ${
          p.quantity > 0 ? 'disponível' : 'sob consulta'
        }`
    )
    .join('\n');
}

const SYSTEM_BASE = `Você é o assistente virtual da Ótica Roland na Vila Mariana, São Paulo.
Seu tom é educado, técnico e acolhedor.
REGRAS CRÍTICAS:
1. Responda de forma CURTA e DIRETA (máximo 3 frases).
2. NÃO FAZEMOS exames de vista na loja. Indicamos parceiros de confiança via WhatsApp.
3. NÃO oferecemos café.
4. Horário: Segunda a Sexta 10h às 17h, Sábado 10h às 14h.
5. Convide para visitar: Av. Domingos de Morais, 138, Vila Mariana.
6. Use apenas produtos listados abaixo quando perguntado sobre preços.`;

export type ChatMessage = { role: 'user' | 'model'; parts: [{ text: string }] };

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY não configurada.');
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return this.ai;
  }

  async getAdvice(
    userPrompt: string,
    history: ChatMessage[],
    activeProducts: Product[]
  ): Promise<string> {
    const sanitized = userPrompt.trim().slice(0, 500);
    if (!sanitized) return '';

    try {
      const client = this.getClient();
      const systemInstruction = `${SYSTEM_BASE}\n\nPRODUTOS DISPONÍVEIS NA LOJA:\n${buildProductContext(activeProducts)}`;

      const contents: ChatMessage[] = [
        ...history,
        { role: 'user', parts: [{ text: sanitized }] },
      ];

      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text || 'Pode repetir? Tive um pequeno problema.';
    } catch {
      return 'Estou offline no momento. O Sr. Walter te espera na loja física!';
    }
  }
}

export const geminiService = new GeminiService();
