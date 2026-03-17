import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Bird, Search, Sparkles, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

export default async function Home() {
  const products = await getProducts();

  const categories = [
    { name: 'Perros', icon: <Dog className="w-6 h-6" />, color: 'bg-primary/10 text-primary' },
    { name: 'Gatos', icon: <Cat className="w-6 h-6" />, color: 'bg-secondary/20 text-foreground' },
    { name: 'Aves', icon: <Bird className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Higiene', icon: <Sparkles className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-12">
      {/* Search Bar - Mobile Only (Prominent style) */}
      <div className="px-4 pt-4 lg:hidden">
        <div className="relative group max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="¿Qué busca tu regalón hoy?" 
            className="w-full h-14 bg-white rounded-3xl pl-14 pr-6 shadow-sm border-none focus:ring-2 focus:ring-primary outline-none text-sm font-semibold transition-all"
          />
        </div>
      </div>

      {/* Hero / Promo Banner - Responsive */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="relative h-48 md:h-80 lg:h-96 w-full rounded-[2.5rem] overflow-hidden bg-primary shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center gap-3 z-10 max-w-xl">
            <h2 className="text-white text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              ¡BAKÁN! <br /> <span className="text-secondary uppercase">30% OFF</span> en Alimentos
            </h2>
            <p className="text-white/90 text-sm md:text-lg font-medium max-w-xs">
              Solo por este fin de semana. Cuida a tu peludo con lo mejor de Chile.
            </p>
            <Link href="/productos">
              <Button size="lg" className="w-fit mt-4 rounded-full bg-white text-primary font-bold hover:bg-secondary hover:text-white transition-all gap-2 h-12 px-8 group">
                Ver Promoción <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-full md:w-3/5 h-full">
             <Image
              src="https://picsum.photos/seed/happy-dog-hero/1200/800"
              alt="Perro feliz promoción"
              fill
              className="object-cover opacity-40 md:opacity-100"
              priority
              data-ai-hint="happy dog"
            />
            {/* Gradient Overlay for mobile readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent md:hidden"></div>
          </div>
        </div>
      </section>

      {/* Horizontal Categories - Responsive Container */}
      <section className="space-y-4 max-w-7xl mx-auto w-full">
        <div className="px-4 flex items-center justify-between">
          <h3 className="font-extrabold text-xl md:text-2xl tracking-tight">Categorías</h3>
          <Link href="/productos" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto px-4 no-scrollbar snap-x md:justify-start lg:justify-between py-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-3 snap-center min-w-[100px] cursor-pointer group">
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-xl",
                cat.color
              )}>
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Grid - Fully Responsive */}
      <section className="px-4 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xl md:text-2xl tracking-tight">Destacados para ti</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Secondary Banner - Desktop Only */}
      <section className="px-4 max-w-7xl mx-auto w-full hidden md:block mt-8">
        <div className="bg-secondary/10 rounded-[2.5rem] p-12 flex items-center justify-between border border-secondary/20">
          <div className="max-w-md space-y-4">
            <h3 className="text-3xl font-bold text-foreground">Asesor de Nutrición AI</h3>
            <p className="text-muted leading-relaxed">
              ¿No sabes qué alimento elegir? Nuestra inteligencia artificial analiza la raza y edad de tu peludo para darte la recomendación perfecta.
            </p>
            <Button className="rounded-2xl bg-secondary text-foreground font-bold hover:scale-105 transition-transform h-12 px-8">
              Probar Asesoría Pro
            </Button>
          </div>
          <div className="relative w-64 h-64">
            <Image 
              src="https://picsum.photos/seed/dog-ai/400/400" 
              alt="AI Assistant" 
              fill 
              className="object-contain"
              data-ai-hint="dog ai"
            />
          </div>
        </div>
      </section>
    </div>
  );
}