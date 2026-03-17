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
  Bone,
  Rabbit,
  Rat,
  Turtle,
  Beef,
} from 'lucide-react';
import { getProducts, Product, BRANDS } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

export default async function Home() {
  const rawProducts = await getProducts();

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

  const categoriesCards = [
    {
      title: "Alimento Seco",
      desc: "Nutrición completa para el día a día.",
      icon: <Bone className="w-10 h-10" />,
      color: "bg-primary text-white",
      href: "/catalogo?cat=Alimento Seco",
      image: "https://picsum.photos/seed/dryfood/600/400"
    },
    {
      title: "Alimento Húmedo",
      desc: "Sabor y una hidratación extra.",
      icon: <Beef className="w-10 h-10" />,
      color: "bg-secondary text-primary",
      href: "/catalogo?cat=Alimento Húmedo",
      image: "https://picsum.photos/seed/wetfood/600/400"
    },
    {
      title: "Snacks",
      desc: "Premios saludables para consentirlos.",
      icon: <Sparkles className="w-10 h-10" />,
      color: "bg-accent text-white",
      href: "/catalogo?cat=Snacks",
      image: "https://picsum.photos/seed/snacks/600/400"
    }
  ];

  return (
    <div className="bg-background flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="px-4 py-4 md:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center md:text-left">
                <Badge className="bg-secondary text-primary font-black px-5 py-1.5 rounded-full text-[10px] tracking-[0.2em] border-none shadow-xl shadow-black/10 hover:bg-secondary">
                  BIENESTAR ANIMAL
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                  Nutrición <span className="text-secondary italic">Premium</span> <br /> para tu mascota.
                </h1>
                <p className="text-white/70 text-lg font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
                  Líderes en distribución de las mejores marcas con más de 15 años de trayectoria en Chile.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link href="/catalogo">
                    <Button size="lg" className="h-16 rounded-3xl bg-secondary text-primary font-black px-10 text-lg shadow-xl hover:bg-secondary/90 hover:scale-[1.02] active:scale-95 transition-all">
                      Ir al Catálogo <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative aspect-square max-w-md ml-auto">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-150 animate-pulse"></div>
                <Image
                  src="https://picsum.photos/seed/mydog-hero-teal/800/800"
                  alt="MyDog Hero"
                  fill
                  className="object-contain drop-shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
              <Dog className="w-full h-full transform scale-150 rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="px-4 py-2 md:py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-sm border border-primary/5 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {cloneIcon(badge.icon, "w-5 h-5 md:w-6 md:h-6")}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] md:text-sm font-black text-foreground uppercase tracking-tight">{badge.title}</h4>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Nuestros Amigos</h2>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Explora por mascota</h3>
          </div>
          <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-14 no-scrollbar pt-4 pb-8 snap-x">
            {[
              { name: 'Perros', icon: <Dog />, color: 'bg-primary/5 text-primary' },
              { name: 'Gatos', icon: <Cat />, color: 'bg-secondary/10 text-secondary' },
              { name: 'Aves', icon: <Bird />, color: 'bg-blue-50 text-blue-600' },
              { name: 'Conejo', icon: <Rabbit />, color: 'bg-rose-50 text-rose-600' },
              { name: 'Roedor', icon: <Rat />, color: 'bg-amber-50 text-amber-600' },
              { name: 'Peces', icon: <Fish />, color: 'bg-indigo-50 text-indigo-600' },
              { name: 'Tortugas', icon: <Turtle />, color: 'bg-emerald-50 text-emerald-600' },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer snap-center shrink-0">
                <div className={cn(
                  "w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500",
                  cat.color
                )}>
                  {cloneIcon(cat.icon, "w-8 h-8 md:w-14 md:h-14")}
                </div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="bg-white/50 py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="flex items-end justify-between border-b border-primary/5 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-4xl font-black text-primary tracking-tighter">Novedades</h2>
              <p className="text-muted-foreground text-sm font-medium">Las mejores marcas de nutrición certificada</p>
            </div>
            <Link href="/catalogo">
              <Button variant="ghost" className="rounded-full text-primary font-black gap-2 hover:bg-primary/5 text-sm">
                Ver todo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Destacados por Categoría - Tricolor */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoriesCards.map((cat, i) => (
              <div key={i} className={cn(
                "group relative h-96 rounded-[3rem] overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-500",
                cat.color
              )}>
                <Image 
                  src={cat.image} 
                  alt={cat.title} 
                  fill 
                  className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="relative h-full p-10 flex flex-col justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black tracking-tighter">{cat.title}</h4>
                    <p className="font-medium opacity-80 text-sm">{cat.desc}</p>
                    <Link href={cat.href}>
                      <Button variant="outline" className="mt-4 rounded-2xl border-current font-black hover:bg-white/10 hover:border-white transition-all">
                        Explorar Ahora
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Marcas Carrusel */}
      <section className="py-8 bg-white/30 border-y border-black/[0.03] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h4 className="text-[10px] font-black text-center text-primary/40 uppercase tracking-[0.4em] mb-10">Con la confianza de las mejores marcas</h4>
          <div className="flex gap-12 md:gap-24 animate-scroll w-max whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={i} className="text-xl md:text-3xl font-black text-primary/20 hover:text-primary/100 transition-colors cursor-default uppercase tracking-tighter">
                {brand}
              </span>
            ))}
          </div>
        </div>
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
