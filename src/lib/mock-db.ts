export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nutrición Especializada Fase Adulta',
    description: 'Fórmula de alto rendimiento energético diseñada para optimizar la salud digestiva y el pelaje.',
    price: 38990,
    category: 'Nutrición Clínica',
    imageUrl: 'https://picsum.photos/seed/dogfood1/600/600',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Mordedor de Polímero Técnico',
    description: 'Accesorio de alta resistencia para estimulación cognitiva y profilaxis dental mecánica.',
    price: 8500,
    category: 'Accesorios Técnicos',
    imageUrl: 'https://picsum.photos/seed/dogtoy1/600/600',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Soporte Ortopédico de Alta Densidad',
    description: 'Superficie viscoelástica con certificación ergonómica para soporte articular prolongado.',
    price: 65900,
    category: 'Mobiliario',
    imageUrl: 'https://picsum.photos/seed/dogbed1/600/600',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Sistema de Sujeción Ergonómico',
    description: 'Equipamiento de paseo con materiales reflectantes de alta visibilidad y diseño anatómico.',
    price: 18900,
    category: 'Accesorios Técnicos',
    imageUrl: 'https://picsum.photos/seed/dogharness1/600/600',
    rating: 4.6
  }
];

export async function getProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PRODUCTS.find(p => p.id === id);
}
