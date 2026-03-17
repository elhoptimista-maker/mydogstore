export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  petType: string;
  brand: string;
  imageUrl: string;
  rating: number;
}

export const CATEGORIES = [
  "Accesorios",
  "Alimento Húmedo",
  "Alimento Seco",
  "Arena Sanitaria",
  "Farmacia",
  "Granos",
  "Higiene y Cuidado",
  "Snacks"
];

export const PET_TYPES = [
  "Perro",
  "Gato",
  "Aves",
  "Conejo y Roedor",
  "Peces y Tortugas"
];

export const BRANDS = [
  "Animal Planet", "Appetit", "Astro Cat", "Biancat", "Bio Stones", "Black Dog", 
  "Buddy Pet", "Cacique", "Can", "Cannes", "Capitan", "Cat Buffet", "Cat Chow", 
  "Catmania", "Cats Snack", "Champion Cat", "Champion Dog", "Churu", "Cisternas", 
  "Colagepet", "Cremoso", "Cuchito", "Dentalife", "Dentastix", "Dog Buffet", 
  "Dog Chow", "Doguitos", "Doko", "Easy Clean", "Economican", "Fans Dog", 
  "Felinnes", "Felix", "Fiprodrag", "Fit Formula", "Full Cat", "Full Dog", 
  "Gati", "Invermic", "Kilikat", "Kimber", "KN22", "Knino", "Leopet", "Leroy", 
  "Limpcat", "Martdor", "Masko Cat", "Masko Dog", "Master Cat", "Master Dog", 
  "Mebermic", "Meraki", "Michi Love", "Mini Cat", "Misifus", "My Dog", 
  "Natural Food", "Nero", "Noba", "Nomade", "Pedigree", "Petclean", "Purina One", 
  "Rabito", "Raza", "Rodeo", "Roquita", "Sabrokan", "Safari", "Simparica", 
  "Top-K9", "Turbo Clean", "Tyson", "Virubed", "Whiskas"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Alimento Seco Premium Adulto',
    description: 'Nutrición balanceada con ingredientes seleccionados para una salud óptima.',
    price: 38990,
    category: 'Alimento Seco',
    petType: 'Perro',
    brand: 'Master Dog',
    imageUrl: 'https://picsum.photos/seed/dogfood/600/600',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Snack Dental para Caninos',
    description: 'Ayuda a reducir la formación de sarro y mantiene el aliento fresco.',
    price: 8500,
    category: 'Snacks',
    petType: 'Perro',
    brand: 'Dentastix',
    imageUrl: 'https://picsum.photos/seed/snack/600/600',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Arena Sanitaria Ultra Absorbente',
    description: 'Control de olores superior y fácil limpieza para el hogar.',
    price: 12900,
    category: 'Arena Sanitaria',
    petType: 'Gato',
    brand: 'Easy Clean',
    imageUrl: 'https://picsum.photos/seed/catlitter/600/600',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Alimento Húmedo Filetes en Salsa',
    description: 'Exquisita receta con proteínas de alta calidad para paladares exigentes.',
    price: 1500,
    category: 'Alimento Húmedo',
    petType: 'Gato',
    brand: 'Whiskas',
    imageUrl: 'https://picsum.photos/seed/catfood/600/600',
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
