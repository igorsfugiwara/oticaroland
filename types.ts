export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imageUrl: string;
  isConsultative: boolean;
  active: boolean;
  order: number;
  tags: string[]; // ex: ["solar", "masculino", "premium"]
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface SiteConfig {
  shopName: string;
  whatsapp: string;
  address: string;
  workingHours: { weekdays: string; saturday: string };
  heroTitle: string;
  heroSubtitle: string;
}
