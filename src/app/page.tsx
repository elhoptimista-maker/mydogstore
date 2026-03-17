
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dog, 
  Sparkles, 
  ArrowRight, 
  Truck,
  ShieldCheck,
  Bone,
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
      emoji: "🦴",
      color: "bg-primary text-white",
      btnClass: "bg-secondary text-primary hover:bg-secondary/90",
      href: "/catalogo?cat=Alimento Seco",
      image: "https://picsum.photos/seed/dryfood/600/400"
    },
    {
      title: "Alimento Húmedo",
      desc: "Sabor y una hidratación extra.",
      emoji: "🥩",
      color: "bg-secondary text-primary",
      btnClass: "bg-primary text-white hover:bg-primary/90",
      href: "/catalogo?cat=Alimento Húmedo",
      image: "https://picsum.photos/seed/wetfood/600/400"
    },
    {
      title: "Snacks",
      desc: "Premios saludables para consentirlos.",
      emoji: "✨",
      color: "bg-accent text-white",
      btnClass: "bg-white text-accent hover:bg-white/90",
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
                <Badge className="bg-secondary text-primary font-black px-5 py-1.5 rounded-full text-[10px] tracking-[0.2em] border-none shadow-xl shadow-black/10">
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
                    <Button size="lg" className="h-16 rounded-3xl bg-secondary text-primary font-black px-10 text-lg shadow-xl hover:bg-secondary/90 hover:scale-[1.02] active:scale-95 transition-all border-none">
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
                  data-ai-hint="happy dog"
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
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-primary/5 grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {cloneIcon(badge.icon, "w-6 h-6")}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{badge.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Nuestros Amigos</h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">Explora por mascota</h3>
          </div>
          <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-14 no-scrollbar pt-4 pb-12 snap-x">
            {[
              { name: 'Perros', emoji: '🐶', color: 'bg-primary/5' },
              { name: 'Gatos', emoji: '🐱', color: 'bg-secondary/10' },
              { name: 'Aves', emoji: '🦜', color: 'bg-blue-50' },
              { name: 'Conejo', emoji: '🐰', color: 'bg-rose-50' },
              { name: 'Roedor', emoji: '🐹', color: 'bg-amber-50' },
              { name: 'Peces', emoji: '🐠', color: 'bg-indigo-50' },
              { name: 'Tortugas', emoji: '🐢', color: 'bg-emerald-50' },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer snap-center shrink-0">
                <div className={cn(
                  "w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:-translate-y-3 transition-all duration-500",
                  cat.color
                )}>
                  <span className="text-5xl md:text-6xl select-none">{cat.emoji}</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="bg-white/50 py-10 md:py-12 border-y border-black/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tighter leading-none">Novedades</h2>
              <p className="text-muted-foreground text-sm font-medium">Nutrición de vanguardia para paladares exigentes</p>
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

      {/* 5. Modernized Category Cards */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {categoriesCards.map((cat, i) => (
              <div key={i} className={cn(
                "group relative h-[480px] rounded-[3.5rem] overflow-hidden shadow-2xl hover:-translate-y-4 transition-all duration-700",
                cat.color
              )}>
                <Image 
                  src={cat.image} 
                  alt={cat.title} 
                  fill 
                  className="object-cover opacity-15 group-hover:scale-110 transition-transform duration-1000" 
                  data-ai-hint="pet food"
                />
                <div className="relative h-full p-12 flex flex-col justify-between z-10">
                  <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
                    <span className="text-5xl">{cat.emoji}</span>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h4 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9]">{cat.title}</h4>
                      <p className="font-bold opacity-80 text-sm md:text-base leading-relaxed max-w-[220px]">{cat.desc}</p>
                    </div>
                    <Link href={cat.href}>
                      <Button className={cn(
                        "h-16 px-10 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all border-none w-full md:w-auto",
                        cat.btnClass
                      )}>
                        Explorar Ahora
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Marcas Carrusel */}
      <section className="py-12 bg-white/30 border-y border-black/[0.03] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h4 className="text-[10px] font-black text-center text-primary/40 uppercase tracking-[0.4em] mb-12">Alianzas que garantizan calidad</h4>
          <div className="flex gap-16 md:gap-32 animate-scroll w-max whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={i} className="text-2xl md:text-4xl font-black text-primary/15 hover:text-primary transition-all duration-500 cursor-default uppercase tracking-tighter">
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
