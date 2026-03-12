import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export interface GeminiRequest {
  userMessage: string;
  products: Product[];
  history: Message[];
}

function buildProductContext(products: Product[]): string {
  if (!products.length) return 'Nenhum produto disponível no momento.';
  return products
    .map(
      p =>
        `• ${p.name} — R$${p.price.toFixed(2)} | ${p.tags.join(', ')} | ${p.description} | Estoque: ${
          p.quantity > 0 ? `${p.quantity} unidades` : 'sob consulta'
        }`
    )
    .join('\n');
}

class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY não encontrada. Verifique o .env.local');
    }
    if (!this.ai) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return this.ai;
  }

  async getResponse(request: GeminiRequest): Promise<string> {
    const userMessage = request.userMessage.trim().slice(0, 500);
    if (!userMessage) return '';

    const systemInstruction = `Você é o assistente virtual da Ótica Roland na Vila Mariana, São Paulo. Tom: educado, técnico e acolhedor.

REGRAS:
1. Responda de forma CURTA e DIRETA (máximo 3 frases).
2. NÃO fazemos exames de vista. Indicamos parceiros — peça para contatar via WhatsApp.
3. Horário: Segunda a Sexta 10h–17h, Sábado 10h–14h.
4. Endereço: Av. Domingos de Morais, 138 — Vila Mariana.
5. Para compras, oriente a usar o carrinho do site ou WhatsApp.
6. Use APENAS os produtos listados abaixo para responder sobre preços e disponibilidade. Nunca invente produtos ou preços.
7. Se não souber responder, diga: "Para essa dúvida, o Sr. Walter pode te ajudar melhor pelo WhatsApp."

PRODUTOS DISPONÍVEIS AGORA:
${buildProductContext(request.products)}`;

    // Mantém no máximo 10 mensagens de histórico (5 trocas)
    const trimmedHistory = request.history.slice(-10);

    const contents = [
      ...trimmedHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    try {
      const client = this.getClient();
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: { systemInstruction, temperature: 0.7 },
      });
      return response.text || 'Pode repetir? Tive um pequeno problema.';
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
