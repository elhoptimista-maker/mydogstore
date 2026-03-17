
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
    name: 'Royal Canine Adult Blend',
    description: 'Scientifically formulated dry food for adult dogs of all sizes, ensuring optimal health and shiny coat.',
    price: 54.99,
    category: 'Food',
    imageUrl: 'https://picsum.photos/seed/food1/600/600',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Kong Classic Rubber Toy',
    description: 'Ultra-durable natural rubber toy that satisfies natural chewing instincts and provides mental stimulation.',
    price: 18.50,
    category: 'Toys',
    imageUrl: 'https://picsum.photos/seed/toy1/600/600',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Cloud Nine Memory Bed',
    description: 'Premium orthopedic memory foam bed designed for joint support and maximum comfort for senior dogs.',
    price: 89.00,
    category: 'Beds',
    imageUrl: 'https://picsum.photos/seed/bed1/600/600',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Reflective Pro Leash',
    description: 'Highly reflective nylon leash with a padded handle for comfort and a heavy-duty carabiner for safety.',
    price: 24.95,
    category: 'Accessories',
    imageUrl: 'https://picsum.photos/seed/leash1/600/600',
    rating: 4.6
  }
];

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return MOCK_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 30));
  return MOCK_PRODUCTS.find(p => p.id === id) || null;
}
