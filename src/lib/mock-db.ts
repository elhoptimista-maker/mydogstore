export interface Product {
  id: string;
  active: boolean;
  attributes: {
    brand: string;
    breed_size: string;
    category: string;
    flavor?: string;
    format: string;
    is_prescription: boolean;
    life_stage: string;
    species: string;
    weight_kg: number;
  };
  content: {
    full_description: string;
    short_description: string;
  };
  financials: {
    cost?: {
      net: number;
    };
    pricing: {
      base_price: number;
    };
  };
  media: {
    main_image: string;
    imageHint: string;
  };
  metadata: {
    name: string;
    sku: string;
    slug: string;
  };
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
    id: "2ByY6esYoWz0C1dp66lw",
    active: true,
    attributes: {
      brand: "Champion Dog",
      breed_size: "Todas las Razas",
      category: "Alimento Seco",
      flavor: "Carne",
      format: "Saco",
      is_prescription: false,
      life_stage: "Adulto",
      species: "Perro",
      weight_kg: 18
    },
    content: {
      full_description: "",
      short_description: "Alimento seco Champion para perros adultos. Con sabor a carne, proporciona la energía y nutrientes esenciales para su bienestar diario."
    },
    financials: {
      cost: {
        net: 21002
      },
      pricing: {
        base_price: 24550
      }
    },
    media: {
      main_image: "https://www.fullerton.cl/wp-content/uploads/CHC-adulto-carne-pollo-2023.jpg",
      imageHint: "dog food bag meat"
    },
    metadata: {
      name: "Champion Perro Adulto Carne - 18kg",
      sku: "ALI-PER-5918",
      slug: "champion-perro-adulto-carne---18kg"
    }
  },
  {
    id: "prod_2",
    active: true,
    attributes: {
      brand: "Whiskas",
      breed_size: "Todas las Razas",
      category: "Alimento Húmedo",
      flavor: "Salmón",
      format: "Sobre",
      is_prescription: false,
      life_stage: "Adulto",
      species: "Gato",
      weight_kg: 0.085
    },
    content: {
      full_description: "",
      short_description: "Exquisita receta de salmón en salsa para gatos adultos."
    },
    financials: {
      cost: {
        net: 1050
      },
      pricing: {
        base_price: 1500
      }
    },
    media: {
      main_image: "https://picsum.photos/seed/catfood/600/600",
      imageHint: "cat food pouch"
    },
    metadata: {
      name: "Whiskas Gato Adulto Salmón - 85g",
      sku: "ALI-GAT-1234",
      slug: "whiskas-gato-adulto-salmon"
    }
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
