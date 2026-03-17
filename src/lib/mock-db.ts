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
    name: 'Alimento Premium Adulto',
    description: 'Nutrición balanceada con ingredientes 100% naturales para tu peludo.',
    price: 45990,
    category: 'Nutrición',
    imageUrl: 'https://picsum.photos/seed/dogfood1/600/600',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Juguete de Caucho Natural',
    description: 'Ultra resistente, diseñado para horas de diversión y limpieza dental.',
    price: 12500,
    category: 'Juguetes',
    imageUrl: 'https://picsum.photos/seed/dogtoy1/600/600',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Cama Ortopédica Viscoelástica',
    description: 'El descanso que tu regalón merece con soporte para sus articulaciones.',
    price: 78900,
    category: 'Descanso',
    imageUrl: 'https://picsum.photos/seed/dogbed1/600/600',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Arnés Reflectante Ergonómico',
    description: 'Paseos seguros y cómodos con visibilidad nocturna mejorada.',
    price: 22900,
    category: 'Paseo',
    imageUrl: 'https://picsum.photos/seed/dogharness1/600/600',
    rating: 4.6
  }
];

export async function getProducts(): Promise<Product[]> {
  // Simulación de delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PRODUCTS;
}