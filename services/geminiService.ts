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
  onAddToCart?: (productId: string) => Product | null;
  onOpenCart?: () => void;
}

function buildProductContext(products: Product[]): string {
  if (!products.length) return 'Nenhum produto disponível no momento.';
  return products
    .map(
      p =>
        `• ${p.name} (id: ${p.id}) — R$${p.price.toFixed(2)} | ${p.tags.join(', ')} | ${p.description} | Estoque: ${
          p.quantity > 0 ? `${p.quantity} unidades` : 'sob consulta'
        }`
    )
    .join('\n');
}

// Definição das tools disponíveis para o modelo
const tools = [
  {
    functionDeclarations: [
      {
        name: 'add_to_cart',
        description:
          'Adiciona um produto ao carrinho do usuário. Use quando o usuário demonstrar intenção clara de compra de um produto específico.',
        parameters: {
          type: 'object',
          properties: {
            product_id: {
              type: 'string',
              description: 'O id exato do produto listado no catálogo',
            },
          },
          required: ['product_id'],
        },
      },
      {
        name: 'open_cart',
        description:
          'Abre o carrinho do usuário. Use quando o usuário quiser ver o carrinho ou finalizar a compra.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ],
  },
];

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
5. Use APENAS os produtos listados abaixo. Nunca invente produtos ou preços.
6. Se não souber responder, diga: "Para essa dúvida, o Sr. Walter pode te ajudar melhor pelo WhatsApp."
7. Quando o usuário quiser comprar um produto específico, use a função add_to_cart com o product_id correto do catálogo.
8. Quando o usuário quiser ver o carrinho ou finalizar a compra, use a função open_cart.
9. Após adicionar ao carrinho, confirme com uma mensagem curta e positiva.

PRODUTOS DISPONÍVEIS AGORA:
${buildProductContext(request.products)}`;

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

      // Primeira chamada — modelo pode retornar texto ou function_call
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: { systemInstruction, temperature: 0.7, tools },
      });

      const candidate = response.candidates?.[0];
      const part = candidate?.content?.parts?.[0];

      // Se o modelo decidiu chamar uma função
      if (part?.functionCall) {
        const { name, args } = part.functionCall;
        let functionResult = '';

        if (name === 'add_to_cart' && request.onAddToCart) {
          const product = request.onAddToCart(args.product_id as string);
          functionResult = product
            ? `Produto "${product.name}" adicionado ao carrinho com sucesso.`
            : `Produto com id "${args.product_id}" não encontrado no catálogo.`;
        }

        if (name === 'open_cart' && request.onOpenCart) {
          request.onOpenCart();
          functionResult = 'Carrinho aberto com sucesso.';
        }

        // Segunda chamada — modelo recebe o resultado da função e gera resposta final
        const contentsWithFunction = [
          ...contents,
          { role: 'model', parts: [{ functionCall: { name, args } }] },
          {
            role: 'user',
            parts: [{ functionResponse: { name, response: { result: functionResult } } }],
          },
        ];

        const finalResponse = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contentsWithFunction,
          config: { systemInstruction, temperature: 0.7 },
        });

        return finalResponse.text || 'Pronto! Como posso ajudar mais?';
      }

      // Resposta de texto normal
      return response.text || 'Pode repetir? Tive um pequeno problema.';
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();