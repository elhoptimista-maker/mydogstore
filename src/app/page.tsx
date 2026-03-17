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
  CheckCircle2,
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
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10 wave-bg transform scale-150 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold">
              <Sparkles className="w-4 h-4 text-secondary" /> Compromiso, cercanía y calidad
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Porque tu mascota <br /> merece <span className="text-secondary">lo mejor</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0">
              Más de 15 años de experiencia distribuyendo las mejores marcas para el cuidado y nutrición de tus compañeros.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/productos">
                <Button size="lg" className="w-full sm:w-auto h-14 rounded-2xl bg-white text-primary font-bold hover:bg-secondary hover:text-white transition-all gap-2 px-10 text-lg shadow-xl shadow-black/10">
                  Ver Catálogo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/b2b" className="text-white font-bold hover:underline">Acceso Mayorista</Link>
            </div>
          </div>
          <div className="relative hidden lg:block aspect-square group">
            <div className="absolute inset-0 bg-secondary rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"></div>
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
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f6f6f6"></path>
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-4 max-w-7xl mx-auto w-full -translate-y-12">
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-black/5 grid grid-cols-1 md:grid-cols-3 gap-8 border border-white/50">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-2">
                {stat.icon}
              </div>
              <span className="text-3xl font-black text-primary">{stat.value}</span>
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Product Assistant Section */}
      <section id="asistente" className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
           <ProductAssistant />
        </div>
      </section>

      {/* About Us Preview */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
          <Image 
            src="https://picsum.photos/seed/mydog-history/800/600" 
            alt="Historia MyDog" 
            fill 
            className="object-cover"
            data-ai-hint="family business"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-primary leading-tight">¿Quiénes somos?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Somos una empresa familiar con más de <strong>15 años de experiencia</strong>. Nacimos en 2008 como un pequeño pet shop en La Cisterna, y gracias a nuestro compromiso crecimos hasta convertirnos en distribuidores mayoristas.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-secondary w-6 h-6 shrink-0 mt-1" />
              <p className="font-medium text-foreground/80">Logística consolidada y eficiente para llegar directamente a tu hogar.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-secondary w-6 h-6 shrink-0 mt-1" />
              <p className="font-medium text-foreground/80">Precios competitivos tanto para el comercio como para el cliente final.</p>
            </div>
          </div>
          <Button variant="outline" className="h-12 rounded-xl border-primary text-primary font-bold">Conocer más de nuestra historia</Button>
        </div>
      </section>

      {/* Pet Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <h3 className="text-3xl font-black text-center">Todo para tu <span className="text-primary">mejor amigo</span></h3>
          <div className="flex flex-wrap justify-center gap-8">
            {petTypes.map((pet, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl",
                  pet.color
                )}>
                  {pet.icon}
                </div>
                <span className="font-bold text-foreground/80 group-hover:text-primary transition-colors">{pet.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 max-w-7xl mx-auto w-full space-y-10 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-extrabold text-2xl md:text-4xl tracking-tight text-primary">Novedades en Tienda</h3>
            <p className="text-muted font-medium">Últimas tendencias en nutrición y accesorios certificados</p>
          </div>
          <Link href="/productos">
            <Button className="rounded-2xl bg-secondary text-foreground hover:bg-secondary/90 font-bold h-12 px-8">Explorar Catálogo</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                {benefit.icon}
              </div>
              <h4 className="text-xl font-bold">{benefit.title}</h4>
              <p className="text-white/70 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
