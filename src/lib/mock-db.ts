
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Mezcla Royal Canine Adulto',
    description: 'Comida seca formulada científicamente para perros adultos de todos los tamaños, asegura salud óptima y pelaje brillante.',
    price: 45990,
    category: 'Comida',
    imageUrl: 'https://picsum.photos/seed/food1/600/600',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Juguete Kong Clásico',
    description: 'Caucho natural ultra duradero que satisface los instintos de masticación y entrega estimulación mental.',
    price: 15500,
    category: 'Juguetes',
    imageUrl: 'https://picsum.photos/seed/toy1/600/600',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Cama Nube Nueve Memory',
    description: 'Cama premium de espuma viscoelástica diseñada para soporte articular y máximo confort para perros senior.',
    price: 79000,
    category: 'Camas',
    imageUrl: 'https://picsum.photos/seed/bed1/600/600',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Correa Pro Reflectante',
    description: 'Correa de nylon altamente reflectante con mango acolchado para mayor comodidad y mosquetón de alta resistencia.',
    price: 19950,
    category: 'Accesorios',
    imageUrl: 'https://picsum.photos/seed/leash1/600/600',
    rating: 4.6
  }
];

export async function getProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return MOCK_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 30));
  return MOCK_PRODUCTS.find(p => p.id === id) || null;
}
