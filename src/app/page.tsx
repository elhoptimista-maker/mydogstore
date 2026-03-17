
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Dog, 
  Cat, 
  Bird, 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Users, 
  Store,
  Calendar,
  Fish
} from 'lucide-react';
import { getProducts } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import ProductAssistant from '@/components/ProductAssistant';
import { cn } from '@/lib/utils';

export default async function Home() {
  const products = await getProducts();

  const petTypes = [
    { name: 'Perro', icon: <Dog className="w-8 h-8" />, color: 'bg-[#E6F4F3] text-primary' },
    { name: 'Gato', icon: <Cat className="w-8 h-8" />, color: 'bg-[#FFF3E9] text-[#FF9F43]' },
    { name: 'Aves', icon: <Bird className="w-8 h-8" />, color: 'bg-[#E9F1FF] text-[#4A90E2]' },
    { name: 'Peces', icon: <Fish className="w-8 h-8" />, color: 'bg-[#F4E9FF] text-[#A259FF]' },
  ];

  const benefits = [
    { icon: <Truck className="w-6 h-6" />, title: 'Envíos a todo Chile', desc: 'De Arica a Punta Arenas en la puerta de tu hogar' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Pago 100% Seguro', desc: 'Webpay, tarjetas y transferencias garantizadas' },
    { icon: <Heart className="w-6 h-6" />, title: 'Atención Personalizada', desc: 'Asesoría experta en cada etapa de tu compra' },
  ];

  const stats = [
    { value: '15+', label: 'Años de Experiencia', icon: <Calendar className="w-5 h-5" /> },
    { value: '1.000+', label: 'Clientes Felices', icon: <Users className="w-5 h-5" /> },
    { value: '70+', label: 'Marcas Confiables', icon: <Store className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col gap-0 pb-10 md:pb-20">
      {/* Hero Section */}
      <section className="relative bg-primary pt-20 pb-24 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10 wave-bg transform scale-150 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] md:text-sm font-bold">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-secondary" /> Compromiso, cercanía y calidad
            </div>
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Porque tu mascota <br className="hidden md:block" /> merece <span className="text-secondary">lo mejor</span>
            </h1>
            <p className="text-white/80 text-base md:text-xl font-medium max-w-lg mx-auto lg:mx-0">
              Más de 15 años de experiencia distribuyendo las mejores marcas para el cuidado y nutrición de tus compañeros.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/catalogo" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 rounded-2xl bg-white text-primary font-bold hover:bg-secondary hover:text-white transition-all gap-2 px-10 text-lg shadow-xl">
                  Ver Catálogo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/b2b" className="text-white font-bold hover:underline text-sm md:text-base">Acceso Mayorista</Link>
            </div>
          </div>
          <div className="relative hidden lg:block aspect-square">
            <div className="absolute inset-0 bg-secondary rounded-full opacity-20 blur-3xl"></div>
            <Image
              src="https://picsum.photos/seed/mydog-hero/800/800"
              alt="MyDog Distribuidora"
              fill
              className="object-contain animate-float drop-shadow-2xl"
              priority
              data-ai-hint="happy dog"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f6f6f6"></path>
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-4 max-w-7xl mx-auto w-full -translate-y-10 md:-translate-y-12">
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 shadow-xl shadow-black/5 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 border border-white/50">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center p-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-2">
                {stat.icon}
              </div>
              <span className="text-2xl md:text-3xl font-black text-primary">{stat.value}</span>
              <span className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Product Assistant Section */}
      <section id="asistente" className="bg-muted/10 py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
           <ProductAssistant />
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 max-w-7xl mx-auto w-full space-y-8 md:space-y-10 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-extrabold text-2xl md:text-4xl tracking-tight text-primary">Novedades</h3>
            <p className="text-muted text-sm md:text-base font-medium">Últimas tendencias en nutrición y accesorios</p>
          </div>
          <Link href="/catalogo">
            <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5 font-bold h-11 px-6 text-sm">Ver Todo</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Pet Types */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-10 md:space-y-12">
          <h3 className="text-2xl md:text-3xl font-black text-center">Todo para tu <span className="text-primary">mascota</span></h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {petTypes.map((pet, i) => (
              <div key={i} className="flex flex-col items-center gap-3 md:gap-4 group cursor-pointer">
                <div className={cn(
                  "w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl",
                  pet.color
                )}>
                  {pet.icon}
                </div>
                <span className="font-bold text-xs md:text-sm text-foreground/80 group-hover:text-primary transition-colors">{pet.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-primary py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-white">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                {benefit.icon}
              </div>
              <h4 className="text-lg md:text-xl font-bold">{benefit.title}</h4>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
