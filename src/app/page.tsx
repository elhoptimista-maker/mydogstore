import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Dog, 
  Cat, 
  Bird, 
  Sparkles, 
  ArrowRight, 
  Fish,
  Truck,
  ShieldCheck,
  Heart,
  Clock
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
    
    // Creamos una copia del producto sin la propiedad cost para seguridad
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
    { name: 'Perros', icon: <Dog className="w-7 h-7 md:w-8 md:h-8" />, color: 'bg-primary text-white' },
    { name: 'Gatos', icon: <Cat className="w-7 h-7 md:w-8 md:h-8" />, color: 'bg-primary text-white' },
    { name: 'Aves', icon: <Bird className="w-7 h-7 md:w-8 md:h-8" />, color: 'bg-primary text-white' },
    { name: 'Peces', icon: <Fish className="w-7 h-7 md:w-8 md:h-8" />, color: 'bg-primary text-white' },
    { name: 'Roedores', icon: <Sparkles className="w-7 h-7 md:w-8 md:h-8" />, color: 'bg-primary text-white' },
  ];

  const benefits = [
    { icon: <Truck className="w-5 h-5" />, text: "Envío rápido" },
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Compra segura" },
    { icon: <Clock className="w-5 h-5" />, text: "Soporte 24/7" },
    { icon: <Heart className="w-5 h-5" />, text: "Club MyDog" },
  ];

  return (
    <div className="bg-[#f6f6f6] min-h-screen pb-24">
      {/* Hero Section - Estilo Card Compacto */}
      <section className="px-4 pt-6 pb-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-center md:text-left max-w-xl">
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                  Todo lo que <br /> ellos <span className="text-secondary">aman.</span>
                </h1>
                <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed">
                  Las mejores marcas de nutrición y accesorios con despacho a todo Chile.
                </p>
                <div className="pt-2">
                  <Link href="/catalogo">
                    <Button className="h-14 rounded-2xl bg-secondary text-foreground font-black px-10 text-lg shadow-lg hover:scale-[1.02] transition-transform">
                      Ver Catálogo <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative aspect-square max-w-sm ml-auto">
                <Image
                  src="https://picsum.photos/seed/mydog-hero-v2/600/600"
                  alt="MyDog Hero"
                  fill
                  className="object-contain drop-shadow-2xl animate-float"
                  priority
                  data-ai-hint="happy dog"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Beneficios */}
      <section className="px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-black/5 flex justify-around items-center gap-4 overflow-x-auto no-scrollbar">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                  {benefit.icon}
                </div>
                <span className="text-xs md:text-sm font-bold text-foreground/70 uppercase tracking-tight">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías con Scroll Horizontal */}
      <section className="py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Categorías</h2>
            <Link href="/catalogo" className="text-xs font-bold text-primary hover:underline">Explorar todas</Link>
          </div>
          
          <div className="flex md:flex-wrap md:justify-center overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory gap-6 pb-4">
            {petTypes.map((pet, i) => (
              <div key={i} className="flex-shrink-0 snap-start">
                <div className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:scale-105 active:scale-95",
                    pet.color
                  )}>
                    {pet.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                    {pet.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección "Para tu Mascota" - Grandes Segmentos */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary/10 rounded-[2.5rem] p-8 space-y-4 relative overflow-hidden group h-64 flex flex-col justify-end">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-primary">Raciones</h3>
              <p className="text-sm font-medium text-primary/70">Nutrición balanceada</p>
              <Link href="/catalogo" className="inline-flex items-center mt-4 font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                Ver más <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 -rotate-12 translate-x-4 -translate-y-4">
              <Dog className="w-full h-full text-primary" />
            </div>
          </div>

          <div className="bg-secondary/20 rounded-[2.5rem] p-8 space-y-4 relative overflow-hidden group h-64 flex flex-col justify-end">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-secondary-foreground">Snacks</h3>
              <p className="text-sm font-medium text-secondary-foreground/70">Premios deliciosos</p>
              <Link href="/catalogo" className="inline-flex items-center mt-4 font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                Ver más <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 rotate-12 translate-x-4 -translate-y-4">
              <Sparkles className="w-full h-full text-secondary" />
            </div>
          </div>

          <div className="bg-primary/5 rounded-[2.5rem] p-8 space-y-4 relative overflow-hidden group h-64 flex flex-col justify-end border border-primary/10">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-foreground">Accesorios</h3>
              <p className="text-sm font-medium text-muted-foreground">Estilo y diversión</p>
              <Link href="/catalogo" className="inline-flex items-center mt-4 font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                Ver más <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -rotate-6 translate-x-4 -translate-y-4">
              <Cat className="w-full h-full text-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Novedades / Grid de Productos */}
      <section className="px-4 py-12 space-y-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">Novedades</h2>
              <p className="text-sm text-muted-foreground font-medium">Recién llegados a nuestra bodega</p>
            </div>
            <Link href="/catalogo">
              <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5 font-bold h-11 px-6">
                Ver Todo
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Asistente IA */}
      <section id="asistente" className="px-4 py-12 md:py-20">
         <div className="max-w-7xl mx-auto">
            <ProductAssistant />
         </div>
      </section>
    </div>
  );
}
