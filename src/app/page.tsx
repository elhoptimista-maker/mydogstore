import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Dog, 
  Cat, 
  Bird, 
  Sparkles, 
  ArrowRight, 
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
    // Fórmula: Precio Venta = Costo / (1 - Margen)
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
    { name: 'Perro', icon: <Dog className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-white text-primary' },
    { name: 'Gato', icon: <Cat className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-white text-secondary' },
    { name: 'Aves', icon: <Bird className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-white text-blue-500' },
    { name: 'Peces', icon: <Fish className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-white text-purple-500' },
    { name: 'Roedores', icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />, color: 'bg-white text-orange-500' },
  ];

  return (
    <div className="bg-[#f6f6f6] min-h-screen pb-24">
      {/* Hero "App-Style" Responsive */}
      <section className="px-4 pt-6 pb-4 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Contenido Texto */}
              <div className="space-y-6 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-secondary" /> Premium Pet Care
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                  Calidad que tu <br /> mascota <span className="text-secondary">adora</span>
                </h1>
                <p className="text-white/70 text-base md:text-lg lg:text-xl font-medium leading-relaxed">
                  Distribuidora líder con más de 15 años cuidando a tus mejores amigos con las marcas más confiables del mercado.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/catalogo">
                    <Button className="h-14 md:h-16 rounded-2xl bg-secondary text-foreground font-black px-10 text-lg shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform">
                      Ver Catálogo <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Imagen Desktop */}
              <div className="hidden md:block relative aspect-square lg:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5">
                <Image
                  src="https://picsum.photos/seed/hero-dog-dt/800/600"
                  alt="MyDog Hero"
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="happy dog"
                />
              </div>
            </div>

            {/* Decoración Mobile */}
            <div className="md:hidden absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-l from-primary to-transparent z-10" />
              <Image
                src="https://picsum.photos/seed/hero-app/600/600"
                alt="Hero Background"
                fill
                className="object-cover"
                data-ai-hint="dog background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Responsive */}
      <section className="py-8 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight">Categorías</h2>
            <Link href="/catalogo" className="text-sm font-bold text-primary hover:underline">Ver todas</Link>
          </div>
          
          {/* Scroll en Mobile / Grid Centrado en Desktop */}
          <div className="flex md:flex-wrap md:justify-center overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory gap-6 md:gap-10 pb-4 md:pb-0">
            {petTypes.map((pet, i) => (
              <div key={i} className="flex-shrink-0 snap-start">
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className={cn(
                    "w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:scale-105 active:scale-95",
                    pet.color
                  )}>
                    {pet.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                    {pet.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Mini IA */}
      <section className="px-4 py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-lg md:text-2xl">Asistente IA MyDog</h3>
                <p className="text-xs md:text-base text-muted-foreground font-medium">Recomendaciones de nutrición personalizadas para tu mascota.</p>
              </div>
            </div>
            <Link href="#asistente">
              <Button size="lg" variant="secondary" className="rounded-2xl font-black text-sm px-10 h-14 w-full md:w-auto shadow-lg shadow-secondary/20">
                PROBAR AHORA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Novedades Grid Responsive */}
      <section className="px-4 py-12 md:py-20 space-y-8 md:space-y-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-2 mb-8">
            <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">Novedades</h2>
            <Link href="/catalogo" className="text-sm font-bold text-primary hover:underline">Explorar catálogo completo</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Asistente Section */}
      <section id="asistente" className="px-4 py-12 md:py-24 bg-white/50 border-y border-black/[0.02]">
         <div className="max-w-7xl mx-auto">
            <ProductAssistant />
         </div>
      </section>
    </div>
  );
}
