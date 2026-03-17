import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Bird, Sparkles, ArrowRight, Truck, ShieldCheck, Heart } from 'lucide-react';
import { getProducts } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

export default async function Home() {
  const products = await getProducts();

  const categories = [
    { name: 'Caninos', icon: <Dog className="w-8 h-8" />, color: 'bg-[#E6F4F3] text-primary' },
    { name: 'Felinos', icon: <Cat className="w-8 h-8" />, color: 'bg-[#FFF3E9] text-[#FF9F43]' },
    { name: 'Aves', icon: <Bird className="w-8 h-8" />, color: 'bg-[#E9F1FF] text-[#4A90E2]' },
    { name: 'Cuidado e Higiene', icon: <Sparkles className="w-8 h-8" />, color: 'bg-[#F4E9FF] text-[#A259FF]' },
  ];

  const benefits = [
    { icon: <Truck className="w-6 h-6" />, title: 'Logística Eficiente', desc: 'Despacho prioritario a todo el país' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Canal Profesional', desc: 'Precios competitivos por volumen' },
    { icon: <Heart className="w-6 h-6" />, title: 'Calidad Certificada', desc: 'Garantía técnica de origen' },
  ];

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10 wave-bg transform scale-150 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold animate-pulse">
              <Sparkles className="w-4 h-4 text-secondary" /> Soluciones Integrales para su Negocio
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Socio Estratégico <br /> en Distribución <span className="text-secondary">Animal</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0">
              Abastecemos al sector profesional con nutrición especializada y accesorios de alto estándar internacional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto h-14 rounded-2xl bg-white text-primary font-bold hover:bg-secondary hover:text-white transition-all gap-2 px-10 text-lg shadow-xl shadow-black/10">
                  Ver Catálogo Mayorista <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/b2b" className="text-white font-bold hover:underline">Solicitar apertura de cuenta</Link>
            </div>
          </div>
          <div className="relative hidden lg:block aspect-square group">
            <div className="absolute inset-0 bg-secondary rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"></div>
            <Image
              src="https://picsum.photos/seed/distributor-hero/800/800"
              alt="Distribución profesional"
              fill
              className="object-contain animate-float drop-shadow-2xl"
              priority
              data-ai-hint="professional warehouse"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f6f6f6"></path>
          </svg>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="px-4 max-w-7xl mx-auto w-full -translate-y-12">
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-black/5 grid grid-cols-1 md:grid-cols-3 gap-8 border border-white/50">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
                {benefit.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-foreground text-lg">{benefit.title}</h4>
                <p className="text-muted text-sm">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 space-y-8 max-w-7xl mx-auto w-full">
        <div className="px-4 flex items-center justify-between">
          <h3 className="font-extrabold text-2xl md:text-3xl tracking-tight">Líneas de <span className="text-primary">Especialidad</span></h3>
        </div>
        <div className="flex gap-8 overflow-x-auto px-4 no-scrollbar snap-x py-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-4 snap-center min-w-[120px] cursor-pointer group">
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl",
                cat.color
              )}>
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 max-w-7xl mx-auto w-full space-y-10 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="font-extrabold text-2xl md:text-4xl tracking-tight">Destacados de Inventario</h3>
            <p className="text-muted font-medium">Soluciones con alta rotación para su punto de venta</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="rounded-2xl border-primary text-primary hover:bg-primary/5 font-bold h-12 px-8">Explorar Catálogo</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <h4 className="text-center font-bold text-muted uppercase tracking-widest text-sm">Marcas Representadas</h4>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
             <div className="text-2xl font-black italic">ROYAL-CANIN</div>
             <div className="text-2xl font-black italic">BRAVERY</div>
             <div className="text-2xl font-black italic">ACANA</div>
             <div className="text-2xl font-black italic">ORIJEN</div>
             <div className="text-2xl font-black italic">HILLS</div>
          </div>
        </div>
      </section>
    </div>
  );
}
