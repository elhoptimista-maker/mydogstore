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
    { name: 'Perros', icon: <Dog className="w-8 h-8" />, color: 'bg-[#E6F4F3] text-primary', hint: 'dog' },
    { name: 'Gatos', icon: <Cat className="w-8 h-8" />, color: 'bg-[#FFF3E9] text-[#FF9F43]', hint: 'cat' },
    { name: 'Aves', icon: <Bird className="w-8 h-8" />, color: 'bg-[#E9F1FF] text-[#4A90E2]', hint: 'bird' },
    { name: 'Higiene', icon: <Sparkles className="w-8 h-8" />, color: 'bg-[#F4E9FF] text-[#A259FF]', hint: 'clean' },
  ];

  const benefits = [
    { icon: <Truck className="w-6 h-6" />, title: 'Despacho Express', desc: 'En 24h a todo Chile' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Pago Seguro', desc: 'Transbank & Webpay' },
    { icon: <Heart className="w-6 h-6" />, title: 'Amor Garantizado', desc: 'Productos certificados' },
  ];

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10 wave-bg transform scale-150 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold animate-bounce">
              <Sparkles className="w-4 h-4 text-secondary" /> ¡Nuevo en Chile! Alimento Orgánico
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Todo lo que tu <br /> <span className="text-secondary">regalón</span> necesita
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0">
              Cuidamos a tu mejor amigo con nutrición premium y accesorios de clase mundial. ¡Descubre la experiencia MyDog!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="w-full sm:w-auto h-14 rounded-2xl bg-white text-primary font-bold hover:bg-secondary hover:text-white transition-all gap-2 px-10 text-lg shadow-xl shadow-black/10">
                Ver Catálogo <ArrowRight className="w-5 h-5" />
              </Button>
              <Link href="#" className="text-white font-bold hover:underline">Ver promociones del mes</Link>
            </div>
          </div>
          <div className="relative hidden lg:block aspect-square group">
            <div className="absolute inset-0 bg-secondary rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"></div>
            <Image
              src="https://picsum.photos/seed/happy-dog-3d/800/800"
              alt="Mascota feliz"
              fill
              className="object-contain animate-float drop-shadow-2xl"
              priority
              data-ai-hint="happy dog"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f6f6f6"></path>
          </svg>
        </div>
      </section>

      {/* USP Bar */}
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
          <h3 className="font-extrabold text-2xl md:text-3xl tracking-tight">Categorías <span className="text-primary">Bakánes</span></h3>
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

      {/* Promotional Mosaic */}
      <section className="px-4 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-12">
        <div className="relative h-64 md:h-[450px] rounded-[2.5rem] overflow-hidden bg-secondary/20 border-2 border-secondary/20 group">
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end gap-3 z-10">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter w-fit bg-secondary text-foreground font-bold">OFERTA FLASH</span>
            <h3 className="text-2xl md:text-4xl font-extrabold text-foreground leading-tight">Accesorios <br /> para el paseo</h3>
            <p className="text-muted font-medium">Hasta 40% OFF en arneses</p>
            <Button variant="link" className="w-fit p-0 text-primary font-bold gap-2">Comprar ahora <ArrowRight className="w-4 h-4" /></Button>
          </div>
          <Image
            src="https://picsum.photos/seed/promo1/600/600"
            alt="Promo paseo"
            fill
            className="object-contain absolute -right-20 -top-10 transition-transform duration-700 group-hover:scale-110 opacity-40 md:opacity-100"
            data-ai-hint="dog leash"
          />
        </div>
        <div className="grid grid-rows-2 gap-6">
           <div className="relative rounded-[2.5rem] overflow-hidden bg-[#E6F4F3] border-2 border-primary/10 p-8 flex items-center justify-between group">
              <div className="space-y-2 z-10">
                <h4 className="text-xl font-bold text-primary">Nutrición Pro</h4>
                <p className="text-sm text-muted-foreground">Tu regalón más fuerte</p>
                <Link href="#" className="text-sm font-bold underline text-primary">Ver más</Link>
              </div>
              <div className="relative w-32 h-32 group-hover:scale-110 transition-transform duration-500">
                <Image src="https://picsum.photos/seed/promo2/200/200" alt="Promo comida" fill className="object-contain" data-ai-hint="dog food" />
              </div>
           </div>
           <div className="relative rounded-[2.5rem] overflow-hidden bg-white border-2 border-border/50 p-8 flex items-center justify-between group">
              <div className="space-y-2 z-10 text-center flex flex-col items-center">
                <h4 className="text-xl font-bold text-foreground">Suscríbete & Ahorra</h4>
                <p className="text-sm text-muted-foreground mb-2">Descuento recurrente</p>
                <Button variant="outline" className="rounded-full border-secondary text-secondary font-bold hover:bg-secondary hover:text-white">Únete ahora</Button>
              </div>
              <div className="relative w-32 h-32 opacity-20 md:opacity-100">
                <Image src="https://picsum.photos/seed/promo3/200/200" alt="Subscription" fill className="object-contain" data-ai-hint="dog subscription" />
              </div>
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 max-w-7xl mx-auto w-full space-y-10 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="font-extrabold text-2xl md:text-4xl tracking-tight">Elegidos para ti</h3>
            <p className="text-muted font-medium">Lo más top de esta semana en MyDog Store</p>
          </div>
          <Link href="/productos">
            <Button variant="outline" className="rounded-2xl border-primary text-primary hover:bg-primary/5 font-bold h-12 px-8">Ver todo el catálogo</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Carousel */}
      <section className="py-20 bg-white border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <h4 className="text-center font-bold text-muted uppercase tracking-widest text-sm">Marcas que confían en nosotros</h4>
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
