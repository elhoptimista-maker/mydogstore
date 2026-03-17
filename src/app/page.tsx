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
  Stethoscope,
  Store,
  Users
} from 'lucide-react';
import { getProducts, Product } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import ProductAssistant from '@/components/ProductAssistant';
import { cn } from '@/lib/utils';

export default async function Home() {
  const rawProducts = await getProducts();

  // Lógica de Precios Segura en Servidor: Margen 30% sobre el costo neto
  // Fórmula: Precio Venta = Costo / 0.7
  const products = rawProducts.map(product => {
    const costNet = product.financials?.cost?.net || 0;
    const calculatedPrice = costNet > 0 ? Math.round(costNet / 0.7) : product.financials.pricing.base_price;
    
    // Omitimos el objeto cost para seguridad
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
    { icon: <Truck className="w-6 h-6" />, title: "Entrega a Domicilio", desc: "Despacho a todo Chile" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Compra 100% Segura", desc: "Tus datos protegidos" },
    { icon: <Bone className="w-6 h-6" />, title: "Marcas Certificadas", desc: "Nutrición garantizada" },
    { icon: <Sparkles className="w-6 h-6" />, title: "Club MyDog", desc: "Descuentos exclusivos" },
  ];

  const mainCategories = [
    { name: 'Alimentación', icon: <Bone className="w-8 h-8" />, color: 'bg-primary text-white' },
    { name: 'Juguetes', icon: <Gamepad2 className="w-8 h-8" />, color: 'bg-primary text-white' },
    { name: 'Perros', icon: <Dog className="w-8 h-8" />, color: 'bg-primary text-white' },
    { name: 'Gatos', icon: <Cat className="w-8 h-8" />, color: 'bg-primary text-white' },
    { name: 'Aves', icon: <Bird className="w-8 h-8" />, color: 'bg-primary text-white' },
    { name: 'Peces', icon: <Fish className="w-8 h-8" />, color: 'bg-primary text-white' },
    { name: 'Farmacia', icon: <Stethoscope className="w-8 h-8" />, color: 'bg-primary text-white' },
  ];

  return (
    <div className="bg-[#f6f6f6] min-h-screen pt-4 pb-24 md:pt-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 1. Hero Banner Section - Compacto y Curvo */}
        <section className="px-4">
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-center md:text-left">
                <Badge className="bg-secondary text-foreground font-black px-4 py-1 text-[10px] tracking-[0.2em] border-none">
                  OFERTA IMPERDIBLE
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                  Nutrición <span className="text-secondary underline decoration-4 underline-offset-8">Premium</span> para tu mejor amigo.
                </h1>
                <p className="text-white/80 text-lg font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
                  Las mejores marcas de raciones y accesorios con despacho directo a tu hogar.
                </p>
                <div className="pt-4">
                  <Link href="/catalogo">
                    <Button size="lg" className="h-14 rounded-full bg-secondary text-foreground font-black px-10 text-lg shadow-xl hover:scale-[1.02] transition-transform">
                      Ver Catálogo <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative aspect-square max-w-sm ml-auto">
                <Image
                  src="https://www.fullerton.cl/wp-content/uploads/CHC-adulto-carne-pollo-2023.jpg"
                  alt="Destacado"
                  fill
                  className="object-contain drop-shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
            {/* Wave Effect Layer */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <path fill="#ffffff" d="M40,-62.1C53.3,-55.1,66.5,-45.5,72.8,-32.8C79.1,-20.1,78.5,-4.3,74.1,10.1C69.7,24.5,61.5,37.5,50.8,47.8C40.1,58.1,26.9,65.7,12.5,69.1C-1.9,72.5,-17.5,71.7,-31.4,66.1C-45.3,60.5,-57.5,50.1,-65.4,37.3C-73.3,24.5,-76.9,9.3,-75.1,-5.1C-73.3,-19.5,-66,-33.1,-55.6,-41.8C-45.2,-50.5,-31.7,-54.3,-19.1,-61.8C-6.5,-69.3,5.2,-80.5,19.1,-80.5C33,-80.5,40.1,-62.1,40,-62.1Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </section>

        {/* 2. Trust Badges Bar - Según la estructura de la imagen */}
        <section className="px-4">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/[0.03] grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {badge.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-foreground uppercase tracking-tighter">{badge.title}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{badge.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Segmented Cards ("PARA TU MASCOTA") - Tricolor como la imagen */}
        <section className="px-4 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">Para tu mascota</h2>
            <div className="w-20 h-1 bg-secondary mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#A259FF] rounded-[2.5rem] p-8 h-80 flex flex-col justify-between items-center text-center text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-2">Raciones</h3>
                <p className="text-white/80 text-sm font-medium">Nutrición balanceada</p>
              </div>
              <div className="relative z-10 w-full">
                <Link href="/catalogo">
                  <Button className="w-full h-12 rounded-full bg-secondary text-foreground font-black shadow-lg hover:scale-105 transition-transform border-none">
                    Ver productos
                  </Button>
                </Link>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-20 group-hover:scale-110 transition-transform">
                <Bone className="w-full h-full" />
              </div>
            </div>

            <div className="bg-[#FF9F43] rounded-[2.5rem] p-8 h-80 flex flex-col justify-between items-center text-center text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-2">Snacks</h3>
                <p className="text-white/80 text-sm font-medium">Premios deliciosos</p>
              </div>
              <div className="relative z-10 w-full">
                <Link href="/catalogo">
                  <Button className="w-full h-12 rounded-full bg-white text-foreground font-black shadow-lg hover:scale-105 transition-transform border-none">
                    Ver productos
                  </Button>
                </Link>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-20 group-hover:scale-110 transition-transform">
                <Bone className="w-full h-full" />
              </div>
            </div>

            <div className="bg-[#00D285] rounded-[2.5rem] p-8 h-80 flex flex-col justify-between items-center text-center text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-2">Accesorios</h3>
                <p className="text-white/80 text-sm font-medium">Estilo y confort</p>
              </div>
              <div className="relative z-10 w-full">
                <Link href="/catalogo">
                  <Button className="w-full h-12 rounded-full bg-secondary text-foreground font-black shadow-lg hover:scale-105 transition-transform border-none">
                    Ver productos
                  </Button>
                </Link>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-20 group-hover:scale-110 transition-transform">
                <Bone className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Circular Categories Icons - Scroll Móvil / Grid Desktop */}
        <section className="px-4 py-8">
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">Explora por Categoría</h3>
            <div className="flex overflow-x-auto md:overflow-visible no-scrollbar snap-x gap-6 md:gap-12 w-full justify-start md:justify-center pb-4">
              {mainCategories.map((cat, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer snap-start shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-foreground/60 group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Featured Products - Novedades */}
        <section className="px-4 space-y-10 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tight uppercase">Novedades</h2>
              <p className="text-muted-foreground text-xs md:text-sm font-medium">Últimas tendencias para tu mascota</p>
            </div>
            <Link href="/catalogo">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white font-black px-8">
                Ver Todo
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. Product Assistant */}
        <section id="asistente" className="px-4 py-12">
           <ProductAssistant />
        </section>

      </div>
    </div>
  );
}
