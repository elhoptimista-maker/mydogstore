import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Dog, 
  Cat, 
  Bird, 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Users, 
  Store,
  Calendar,
  Fish
} from 'lucide-react';
import { getProducts, Product } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import ProductAssistant from '@/components/ProductAssistant';
import { cn } from '@/lib/utils';

export default async function Home() {
  const rawProducts = await getProducts();

  // Lógica de Precios Segura en Servidor: Margen 30% sobre el costo neto
  // Sanitizamos el objeto para NUNCA enviar 'cost' al cliente
  const products = rawProducts.map(product => {
    const costNet = product.financials?.cost?.net || 0;
    const calculatedPrice = Math.round(costNet / (1 - 0.30));
    
    // Creamos una copia del producto sin la propiedad cost
    const { financials, ...rest } = product;
    return {
      ...rest,
      financials: {
        pricing: {
          base_price: calculatedPrice || financials.pricing.base_price
        }
      }
    };
  }) as Product[];

  const petTypes = [
    { name: 'Perro', icon: <Dog className="w-5 h-5" />, color: 'bg-white text-primary' },
    { name: 'Gato', icon: <Cat className="w-5 h-5" />, color: 'bg-white text-secondary' },
    { name: 'Aves', icon: <Bird className="w-5 h-5" />, color: 'bg-white text-blue-500' },
    { name: 'Peces', icon: <Fish className="w-5 h-5" />, color: 'bg-white text-purple-500' },
    { name: 'Roedores', icon: <Sparkles className="w-5 h-5" />, color: 'bg-white text-orange-500' },
  ];

  return (
    <div className="bg-[#f6f6f6] min-h-screen pb-24">
      {/* Hero "App-Style" */}
      <section className="px-4 pt-6 pb-2">
        <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="relative z-10 space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-secondary" /> Premium Pet Care
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Calidad que tu <br /> mascota <span className="text-secondary">adora</span>
            </h1>
            <p className="text-white/70 text-sm font-medium">
              Distribuidora líder con más de 15 años cuidando a tus mejores amigos.
            </p>
            <div className="pt-4">
              <Link href="/catalogo">
                <Button className="h-14 rounded-2xl bg-secondary text-foreground font-black px-8 text-md shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform">
                  Ver Catálogo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-primary to-transparent z-10" />
            <Image
              src="https://picsum.photos/seed/hero-app/600/600"
              alt="Hero"
              fill
              className="object-cover"
              data-ai-hint="happy dog"
            />
          </div>
        </div>
      </section>

      {/* Categorías Horizontal Scroll */}
      <section className="py-6 overflow-hidden">
        <div className="flex items-center justify-between px-6 mb-4">
          <h2 className="text-lg font-black text-foreground">Categorías</h2>
          <Link href="/catalogo" className="text-xs font-bold text-primary">Ver todas</Link>
        </div>
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 px-6 py-2">
          {petTypes.map((pet, i) => (
            <div key={i} className="flex-shrink-0 snap-start">
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95",
                  pet.color
                )}>
                  {pet.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">{pet.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Assistant Interface Mini */}
      <section className="px-4 py-4">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente IA</h3>
              <p className="text-[10px] text-muted-foreground">Nutrición personalizada</p>
            </div>
          </div>
          <Link href="#asistente">
            <Button size="sm" variant="secondary" className="rounded-xl font-bold text-[10px] px-4">PROBAR</Button>
          </Link>
        </div>
      </section>

      {/* Novedades Grid */}
      <section className="px-4 py-8 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-foreground">Novedades</h2>
          <Link href="/catalogo" className="text-xs font-bold text-primary">Ver más</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Asistente Section Detalle */}
      <section id="asistente" className="px-4 py-8">
         <ProductAssistant />
      </section>
    </div>
  );
}
