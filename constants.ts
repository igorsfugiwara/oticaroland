import { Product, SiteConfig } from './types';

// Imagens em public/assets/ — URLs estáveis sem hash, seguras para salvar no Firestore.
// Nunca usar static import para assets referenciados em banco de dados.

export const SHOP_INFO: SiteConfig = {
  shopName: 'Ótica Roland',
  whatsapp: '5511998793053',
  address: 'Av. Domingos de Morais, 138, Vila Mariana, SP',
  workingHours: {
    weekdays: '10h às 17h',
    saturday: '10h às 14h',
  },
  heroTitle: 'Refine o seu olhar.',
  heroSubtitle:
    'A união do rigor técnico com a curadoria de design. Peças selecionadas para quem busca conforto e distinção.',
};

export const IMAGES = {
  hero: '/assets/aviador.png',
  // Placeholder — substituir pela foto real do Sr. Walter ou da loja
  story: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=900',
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'aviador-sky',
    name: 'Aviador Sky Edition',
    price: 280,
    description: 'Leveza e proteção com lentes polarizadas de alta definição.',
    quantity: 5,
    imageUrl: '/assets/aviador-solar.png',
    isConsultative: false,
    active: true,
    order: 0,
    tags: ['solar', 'masculino', 'premium'],
  },
  {
    id: 'zeiss-vr-one',
    name: 'Zeiss VR ONE Plus',
    price: 750,
    description: 'Óculos de sol com tecnologia Zeiss de alta performance visual.',
    quantity: 3,
    imageUrl: '/assets/vrone.png',
    isConsultative: false,
    active: true,
    order: 1,
    tags: ['solar', 'premium', 'unissex'],
  },
  {
    id: 'acuvue-oasys',
    name: 'ACUVUE® OASYS com HYDRACLEAR®',
    price: 260,
    description: 'Hidratação contínua para o máximo conforto diário.',
    quantity: 10,
    imageUrl: '/assets/oasis.png',
    isConsultative: false,
    active: true,
    order: 2,
    tags: ['lentes', 'conforto', 'diario'],
  },
  {
    id: 'zeiss-wipes',
    name: 'Zeiss Lens Wipes',
    price: 99,
    description: 'Lenços de limpeza óptica profissional para manutenção das suas lentes.',
    quantity: 20,
    imageUrl: '/assets/lens-wipes.png',
    isConsultative: false,
    active: true,
    order: 3,
    tags: ['acessorios', 'limpeza'],
  },
  {
    id: 'acuvue-moist',
    name: 'Acuvue Moist 1-Day',
    price: 265,
    description: 'Praticidade e saúde ocular em descarte diário.',
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=800',
    isConsultative: false,
    active: true,
    order: 4,
    tags: ['lentes', 'diario', 'descartavel'],
  },
  {
    id: 'solucao-care',
    name: 'Solução Care+',
    price: 85,
    description: 'Solução multipropósito para cuidado completo das lentes de contato.',
    quantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
    isConsultative: false,
    active: true,
    order: 5,
    tags: ['lentes', 'acessorios', 'cuidado'],
  },
];
