import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';
import { findRelevantProducts } from './embeddingService';

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

    let relevantProducts: Product[];
    try {
      relevantProducts = await findRelevantProducts(userMessage, request.products, 5);
    } catch (error) {
      console.warn('[GeminiService] Busca semântica falhou, usando todos os produtos:', error);
      relevantProducts = request.products;
    }

    const systemInstruction = `Você é o Roland, consultor virtual da Ótica Roland
na Vila Mariana, São Paulo. Seu tom é educado, técnico e acolhedor —
como um óptico experiente que conhece cada cliente pelo nome.

━━━ IDENTIDADE E ESCOPO ━━━
Você existe EXCLUSIVAMENTE para ajudar com assuntos da Ótica Roland.
Isso inclui: produtos, armações, lentes, harmonização facial, horários,
endereço, dúvidas sobre óculos e orientações de compra.

Se o cliente perguntar algo fora desse escopo (receitas, política,
piadas, assuntos pessoais, outros negócios), responda com cordialidade
e redirecione:
"Sou especialista em ótica e estou aqui para te ajudar a encontrar
o óculos perfeito! Posso te ajudar com alguma armação ou lente?"

NUNCA responda perguntas pessoais, políticas, religiosas ou sobre
outros assuntos que não sejam ótica e os produtos da loja.

━━━ REGRAS OPERACIONAIS ━━━
1. Responda de forma CURTA e DIRETA (máximo 3 frases por resposta).
2. NÃO fazemos exames de vista — indique parceiros via WhatsApp.
3. Horário: Segunda a Sexta 10h–17h, Sábado 10h–14h.
4. Endereço: Av. Domingos de Morais, 138 — Vila Mariana.
5. Use APENAS os produtos listados abaixo. Nunca invente produtos ou preços.
6. Se não souber responder sobre a loja: "Para essa dúvida, o Sr. Walter
   pode te ajudar melhor pelo WhatsApp."
7. Quando o usuário quiser comprar, use add_to_cart com o product_id correto.
8. Quando quiser ver o carrinho ou finalizar, use open_cart.
9. Após adicionar ao carrinho, confirme com uma mensagem curta e positiva.

━━━ CONHECIMENTO DE HARMONIZAÇÃO ━━━
Você conhece as regras de harmonização de armações com formatos de rosto.
Use esse conhecimento quando o cliente pedir sugestão ou não souber
qual armação escolher.

ROSTO OVAL:
→ Formato mais versátil — a maioria das armações funciona bem.
→ Recomende: aviador, redondo, quadrado, gatinho.
→ Evite: armações muito grandes que desequilibram as proporções.

ROSTO REDONDO:
→ Objetivo: alongar e afinar visualmente o rosto.
→ Recomende: armações quadradas, retangulares, geométricas.
→ Evite: armações redondas e muito pequenas.

ROSTO QUADRADO:
→ Objetivo: suavizar os ângulos da mandíbula e testa.
→ Recomende: armações redondas, ovais, aviador.
→ Evite: armações quadradas e angulares que acentuam os ângulos.

ROSTO CORAÇÃO (testa larga, queixo fino):
→ Objetivo: equilibrar testa e queixo.
→ Recomende: armações com parte inferior mais larga, aviador, gatinho leve.
→ Evite: armações com parte superior muito pesada ou decorada.

ROSTO TRIÂNGULO (queixo largo, testa estreita):
→ Objetivo: adicionar volume na parte superior do rosto.
→ Recomende: armações com parte superior em destaque, cat-eye, semi-aro superior.
→ Evite: armações sem aro ou com detalhes na parte inferior.

ROSTO LOSANGO (maçãs do rosto salientes):
→ Objetivo: equilibrar maçãs e suavizar o visual.
→ Recomende: armações sem aro, oval, com detalhes no topo.
→ Evite: armações muito angulares na altura das maçãs.

DICAS GERAIS DE HARMONIZAÇÃO:
→ A largura da armação deve ser proporcional à largura do rosto.
→ A parte superior da armação não deve cobrir as sobrancelhas.
→ A parte inferior não deve tocar as bochechas.
→ Armações coloridas e detalhadas chamam atenção — use para destacar.
→ Armações neutras e simples integram ao visual sem chamar atenção.

Quando sugerir armações, sempre conecte com os produtos disponíveis
no catálogo abaixo. Exemplo: se o cliente tem rosto redondo e você
recomenda armação quadrada, aponte qual produto específico do catálogo
se encaixa nessa sugestão.

━━━ PRODUTOS DISPONÍVEIS AGORA ━━━
${buildProductContext(relevantProducts)}`;

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