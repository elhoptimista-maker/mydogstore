import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Bone,
  Gamepad2,
} from 'lucide-react';
import { getProducts, Product } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import ProductAssistant from '@/components/ProductAssistant';
import { cn } from '@/lib/utils';

export default async function Home() {
  const rawProducts = await getProducts();

  // Lógica de Precios Segura en Servidor
  const products = rawProducts.map(product => {
    const costNet = product.financials?.cost?.net || 0;
    const calculatedPrice = costNet > 0 ? Math.round(costNet / 0.7) : product.financials.pricing.base_price;
    
    const { financials, ...rest } = product;
    return {
      ...rest,
      financials: {
        pricing: {
          base_price: calculatedPrice
        }
      }
    };
  }) as Product[];

  const trustBadges = [
    { icon: <Truck className="w-6 h-6" />, title: "Entrega Express", desc: "Despacho a todo Chile" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Pago Seguro", desc: "Transacciones protegidas" },
    { icon: <Bone className="w-6 h-6" />, title: "Marcas Premium", desc: "Calidad garantizada" },
    { icon: <Sparkles className="w-6 h-6" />, title: "Club MyDog", desc: "Descuentos exclusivos" },
  ];

  return (
    <div className="bg-background flex flex-col min-h-screen">
      
      {/* 1. Hero Section - Refined & Impactful */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[3rem] p-8 md:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-center md:text-left">
                <Badge className="bg-secondary text-primary font-black px-5 py-1.5 rounded-full text-[10px] tracking-[0.2em] border-none shadow-xl shadow-black/10">
                  NUEVA TEMPORADA
                </Badge>
                <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                  Bienestar <span className="text-secondary italic">Premium</span> <br /> para tu mascota.
                </h1>
                <p className="text-white/70 text-lg md:text-xl font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
                  Expertos en nutrición y accesorios con más de 15 años cuidando a los que más quieres.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/catalogo">
                    <Button size="lg" className="h-16 rounded-3xl bg-secondary text-primary font-black px-10 text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                      Ir al Catálogo <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative aspect-square max-w-lg ml-auto">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-150 animate-pulse"></div>
                <Image
                  src="https://picsum.photos/seed/mydog-hero/800/800"
                  alt="MyDog Hero"
                  fill
                  className="object-contain drop-shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
              <Dog className="w-full h-full transform scale-150 rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="px-4 py-10 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/5 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight mb-1">{badge.title}</h4>
                  <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories - Scroll Horizontal */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xs font-black text-primary/40 uppercase tracking-[0.4em]">Navegación Visual</h2>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight">Explora por mascota</h3>
          </div>
          <div className="flex overflow-x-auto md:justify-center gap-6 md:gap-12 no-scrollbar pb-4 snap-x">
            {[
              { name: 'Perro', icon: <Dog />, color: 'bg-primary/5 text-primary' },
              { name: 'Gato', icon: <Cat />, color: 'bg-secondary/10 text-secondary' },
              { name: 'Aves', icon: <Bird />, color: 'bg-blue-50 text-blue-600' },
              { name: 'Peces', icon: <Fish />, color: 'bg-indigo-50 text-indigo-600' },
              { name: 'Juguetes', icon: <Gamepad2 />, color: 'bg-orange-50 text-orange-600' },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer snap-center shrink-0">
                <div className={cn(
                  "w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500",
                  cat.color
                )}>
                  {cloneIcon(cat.icon, "w-8 h-8 md:w-10 md:h-10")}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products - LARGE CARDS */}
      <section className="bg-white/50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="flex items-end justify-between border-b border-primary/5 pb-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tighter">Novedades</h2>
              <p className="text-muted-foreground font-medium">Selección exclusiva de raciones y accesorios</p>
            </div>
            <Link href="/catalogo">
              <Button variant="ghost" className="rounded-full text-primary font-black gap-2 hover:bg-primary/5">
                Ver todo el catálogo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI Assistant - Seamless Integration */}
      <section id="asistente" className="py-20 md:py-32 bg-primary/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <ProductAssistant />
        </div>
        {/* Visual elements to break the "island" feeling */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      </section>

    </div>
  );
}

function cloneIcon(icon: React.ReactNode, className: string) {
  return icon && typeof icon === 'object' && 'type' in icon ? (
    // @ts-ignore
    <icon.type {...icon.props} className={className} />
  ) : icon;
}