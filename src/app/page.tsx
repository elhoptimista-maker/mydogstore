import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Bird, Sparkles, ArrowRight, Truck, ShieldCheck, Heart, Star } from 'lucide-react';
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
      {/* Hero Section with Organic Wave */}
      <section className="relative bg-primary pt-24 pb-32 md:pt-40 md:pb-56 overflow-hidden">
        <div className="absolute inset-0 opacity-10 wave-bg transform scale-150 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full text-white text-sm font-bold animate-bounce shadow-lg">
              <Sparkles className="w-4 h-4 text-secondary" /> ¡Nuevo en Chile! Alimento Orgánico
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1] tracking-tighter">
              Todo para tu <br /> <span className="text-secondary">regalón</span>
            </h1>
            <p className="text-white/90 text-xl md:text-2xl font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Nutrición premium y accesorios Pro. La experiencia que tu mejor amigo merece.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Button size="lg" className="w-full sm:w-auto h-16 rounded-3xl bg-white text-primary font-black hover:bg-secondary hover:text-white transition-all gap-3 px-12 text-xl shadow-2xl shadow-black/20">
                Ver Catálogo <ArrowRight className="w-6 h-6" />
              </Button>
              <Link href="#" className="text-white text-lg font-bold hover:underline underline-offset-8">Ver promociones</Link>
            </div>
          </div>
          <div className="relative hidden lg:block aspect-square group">
            <div className="absolute inset-0 bg-secondary rounded-full opacity-30 blur-[100px] group-hover:opacity-50 transition-opacity"></div>
            <Image
              src="https://picsum.photos/seed/happy-dog-3d/800/800"
              alt="Mascota feliz"
              fill
              className="object-contain animate-float drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]"
              priority
              data-ai-hint="happy dog"
            />
          </div>
        </div>
        {/* Organic Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f6f6f6"></path>
          </svg>
        </div>
      </section>

      {/* USP Bar - Benefits */}
      <section className="px-4 max-w-7xl mx-auto w-full -translate-y-16">
        <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-black/5 grid grid-cols-1 md:grid-cols-3 gap-12 border border-white/50">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 shadow-sm">
                {benefit.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-foreground text-xl tracking-tight">{benefit.title}</h4>
                <p className="text-muted text-sm font-medium">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories - Circular Pills Style */}
      <section className="py-16 space-y-10 max-w-7xl mx-auto w-full">
        <div className="px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="font-black text-3xl md:text-5xl tracking-tighter">Categorías <span className="text-primary">Bakánes</span></h3>
          <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Lo mejor para cada especie</p>
        </div>
        <div className="flex gap-10 overflow-x-auto px-4 no-scrollbar snap-x py-6">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-6 snap-center min-w-[140px] cursor-pointer group">
              <div className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-primary/20",
                cat.color
              )}>
                {cat.icon}
              </div>
              <span className="text-lg font-black text-foreground/80 group-hover:text-primary transition-colors tracking-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Mosaic Section */}
      <section className="px-4 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 py-16">
        <div className="md:col-span-7 relative h-80 md:h-[550px] rounded-[3rem] overflow-hidden bg-secondary/20 border-2 border-secondary/10 group">
          <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-end gap-5 z-10">
            <Badge variant="secondary" className="w-fit bg-secondary text-foreground font-black px-4 py-2 text-xs">OFERTA FLASH</Badge>
            <h3 className="text-3xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tighter">Accesorios <br /> para el paseo</h3>
            <p className="text-xl text-muted font-bold">Hasta 40% OFF en arneses</p>
            <Button variant="link" className="w-fit p-0 text-primary font-black text-lg gap-2 group-hover:translate-x-2 transition-transform">Comprar ahora <ArrowRight className="w-5 h-5" /></Button>
          </div>
          <Image
            src="https://picsum.photos/seed/promo1/800/800"
            alt="Promo paseo"
            fill
            className="object-contain absolute -right-20 -top-10 transition-transform duration-1000 group-hover:scale-110 opacity-40 md:opacity-100"
            data-ai-hint="dog leash"
          />
        </div>
        <div className="md:col-span-5 grid grid-rows-2 gap-8">
           <div className="relative rounded-[3rem] overflow-hidden bg-[#E6F4F3] border-2 border-primary/5 p-10 flex items-center justify-between group cursor-pointer">
              <div className="space-y-3 z-10">
                <h4 className="text-2xl font-black text-primary tracking-tight">Nutrición Pro</h4>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Pura energía</p>
                <Link href="#" className="text-base font-black underline decoration-2 underline-offset-4 text-primary">Ver más</Link>
              </div>
              <div className="relative w-40 h-40 group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-700">
                <Image src="https://picsum.photos/seed/promo2/300/300" alt="Promo comida" fill className="object-contain" data-ai-hint="dog food" />
              </div>
           </div>
           <div className="relative rounded-[3rem] overflow-hidden bg-white border-2 border-border/40 p-10 flex items-center justify-between group cursor-pointer shadow-xl shadow-black/[0.02]">
              <div className="space-y-4 z-10">
                <h4 className="text-2xl font-black text-foreground tracking-tight">Suscríbete</h4>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Ahorra 15%</p>
                <Button variant="outline" className="rounded-2xl border-2 border-secondary text-secondary font-black px-6 hover:bg-secondary hover:text-white transition-all">Únete ahora</Button>
              </div>
              <div className="relative w-40 h-40 opacity-30 md:opacity-100 group-hover:scale-110 transition-transform duration-700">
                <Image src="https://picsum.photos/seed/promo3/300/300" alt="Subscription" fill className="object-contain" data-ai-hint="dog subscription" />
              </div>
           </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="px-4 max-w-7xl mx-auto w-full space-y-16 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-3">
            <h3 className="font-black text-4xl md:text-6xl tracking-tighter">Elegidos <span className="text-primary">para ti</span></h3>
            <p className="text-xl text-muted font-medium">Lo más top de esta semana en MyDog Store</p>
          </div>
          <Link href="/productos">
            <Button variant="outline" className="rounded-2xl border-2 border-primary text-primary hover:bg-primary/5 font-black h-14 px-10 text-lg shadow-lg">Ver todo el catálogo</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Carousel / Trust Marks */}
      <section className="py-24 bg-white border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <h4 className="text-center font-black text-muted uppercase tracking-[0.3em] text-xs">Marcas con Respaldo Científico</h4>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-3xl font-black italic tracking-tighter">ROYAL-CANIN</div>
             <div className="text-3xl font-black italic tracking-tighter">BRAVERY</div>
             <div className="text-3xl font-black italic tracking-tighter">ACANA</div>
             <div className="text-3xl font-black italic tracking-tighter">ORIJEN</div>
             <div className="text-3xl font-black italic tracking-tighter">HILLS</div>
          </div>
        </div>
      </section>
    </div>
  );
}

const Badge = ({ children, className, variant = "default" }: any) => (
  <span className={cn(
    "px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-black shadow-sm",
    variant === "secondary" ? "bg-secondary text-foreground" : "bg-primary text-white",
    className
  )}>
    {children}
  </span>
);
