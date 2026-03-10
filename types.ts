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

// ─── Clientes ────────────────────────────────────────────────────────────────

export interface EyePrescription {
  spherical: number;    // ex: -2.50
  cylindrical: number;  // ex: -0.75
  axis: number;         // 0 a 180
  dnp: number;          // distância naso-pupilar em mm
}

export interface Prescription {
  id: string;
  date: string;         // ISO: "2024-10-01"
  doctor: string;
  doctorCRM: string;
  od: EyePrescription;  // olho direito
  oe: EyePrescription;  // olho esquerdo
  addition?: number;    // para progressivo/bifocal
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;        // formato: "11999999999"
  birthdate: string;    // ISO: "1985-03-15"
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  prescriptions: Prescription[];
  lastVisit?: string;   // ISO date
  notes?: string;
  createdAt: string;
  active: boolean;
}
