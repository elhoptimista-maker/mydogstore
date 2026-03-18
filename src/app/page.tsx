
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dog, 
  ArrowRight, 
  Truck,
  ShieldCheck,
  Headphones,
  Star,
  Clock,
  Instagram,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react';
import { getProducts } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      
      {/* 2. Bloque Hero */}
      <section className="bg-[#FEF9F3] w-full pt-10 pb-20 overflow-hidden relative border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              🐾 Bienestar animal garantizado
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter">
              Comida Premium <br /> para tu <span className="text-primary">Mascota</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Distribuidora líder en nutrición animal con más de 15 años de trayectoria. Calidad certificada para los que más quieres.
            </p>
            <Button size="lg" className="h-16 rounded-full bg-primary text-white font-black px-10 text-lg shadow-2xl hover:scale-105 transition-all gap-3">
              Explorar Catálogo <ArrowRight className="w-5 h-5" />
            </Button>
            
            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#FEF9F3] overflow-hidden bg-muted shadow-sm">
                    <Image src={`https://picsum.photos/seed/${i+10}/100/100`} alt="usuario" width={48} height={48} />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span className="text-primary font-black">100K+</span> Clientes Felices
              </p>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto md:h-full flex items-end">
            <div className="relative w-full h-[120%] -mb-20">
              <Image
                src="https://picsum.photos/seed/happy-dog/800/1000"
                alt="Mascota Feliz"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                data-ai-hint="happy dog"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Navegación por Píldoras (Categorías Destacadas) */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Explora nuestra tienda</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Compra por <span className="text-primary">Categoría</span>
          </h2>
        </div>
        <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pb-4 snap-x">
          {[
            { name: 'Perros', emoji: '🐶' },
            { name: 'Gatos', emoji: '🐱' },
            { name: 'Aves', emoji: '🦜' },
            { name: 'Conejos', emoji: '🐰' },
            { name: 'Higiene', emoji: '🧼' },
            { name: 'Snacks', emoji: '🦴' },
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-5 group cursor-pointer snap-center shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-primary/20">
                <span className="text-5xl md:text-6xl">{cat.emoji}</span>
              </div>
              <span className="text-sm font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Super-Cards Promocionales (Banners Bicolores) */}
      <section className="py-12 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] relative overflow-hidden p-12 flex items-center shadow-sm hover:shadow-lg transition-all border border-black/5 group">
          <div className="space-y-6 flex-1 z-10">
            <Badge className="bg-yellow-400/20 text-yellow-800 border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">Novedades</Badge>
            <h3 className="text-4xl font-black tracking-tighter leading-none text-foreground">Accesorios <br /><span className="text-primary">Premium</span></h3>
            <Button className="rounded-full bg-primary font-black px-10 h-14 text-white shadow-lg shadow-primary/20">Ver Colección</Button>
          </div>
          <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-700">
            <Image src="https://picsum.photos/seed/acc-cat/400/400" alt="Promo" fill className="object-contain" />
          </div>
        </div>
        <div className="bg-accent rounded-[2.5rem] relative overflow-hidden p-12 flex items-center shadow-sm hover:shadow-lg transition-all group text-accent-foreground border border-black/5">
          <div className="space-y-6 flex-1 z-10">
            <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">Oferta</Badge>
            <h3 className="text-4xl font-black tracking-tighter leading-none">Nutrición <br /><span className="text-primary">Especializada</span></h3>
            <Button className="rounded-full bg-white text-primary font-black px-10 h-14 hover:bg-primary hover:text-white transition-all shadow-lg">Descubrir</Button>
          </div>
          <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-700">
            <Image src="https://picsum.photos/seed/food-cat/400/400" alt="Promo" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* 5. Grilla de Productos Estándar */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="flex flex-row justify-between items-end border-b border-black/5 pb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Selección experta</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Productos <span className="text-primary">Destacados</span></h2>
          </div>
          <Button variant="outline" className="rounded-full font-black border-2 px-8 h-12 border-primary/10 hover:border-primary transition-all">Ver Todos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Sección de Oferta Relámpago (Flash Deal + Cuenta Regresiva) */}
      <section className="bg-white/50 border-y border-black/5 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="hidden lg:block relative h-96">
            <Image src="https://picsum.photos/seed/cat-flash/600/600" alt="Flash" fill className="object-contain drop-shadow-xl" />
          </div>
          <div className="space-y-12 flex flex-col items-center text-center">
            <div className="space-y-3">
              <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Oferta Limitada</h4>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">Hasta <span className="text-primary">50% OFF</span></h2>
            </div>
            {/* Cuenta Regresiva */}
            <div className="flex gap-4">
              {[
                { val: '02', label: 'Días' },
                { val: '14', label: 'Hrs' },
                { val: '45', label: 'Min' },
                { val: '12', label: 'Seg' }
              ].map((item, i) => (
                <div key={i} className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-md border border-black/5">
                  <span className="text-2xl font-black text-primary leading-none">{item.val}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{item.label}</span>
                </div>
              ))}
            </div>
            <Button className="rounded-full bg-primary text-white font-black px-16 h-16 text-xl shadow-2xl hover:scale-105 transition-all">
              Comprar Ahora
            </Button>
          </div>
          <div className="hidden lg:block relative h-96">
            <Image src="https://picsum.photos/seed/dog-flash/600/600" alt="Flash" fill className="object-contain drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* 7. Tarjetas de Producto Horizontales (Deals of the Day) */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground text-center">Ofertas del <span className="text-primary">Día</span></h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.slice(0, 2).map((product, i) => (
            <div key={i} className="flex flex-row bg-white rounded-[2rem] p-6 border border-black/5 gap-8 shadow-sm hover:shadow-md transition-all">
              <div className="relative w-40 h-40 shrink-0 overflow-hidden rounded-2xl bg-muted/30">
                <Image src={product.media.main_image} alt={product.metadata.name} fill className="object-contain p-4" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black text-foreground">4.9 (42 reseñas)</span>
                </div>
                <h4 className="font-black text-xl text-foreground line-clamp-1">{product.metadata.name}</h4>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-primary">${product.financials.pricing.base_price.toLocaleString('es-CL')}</span>
                  <span className="text-sm text-muted-foreground line-through font-bold">${(product.financials.pricing.base_price * 1.3).toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <span>Vendido: 75/100</span>
                    <span className="text-primary">¡Casi agotado!</span>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-primary text-white font-black h-12 shadow-lg shadow-primary/10">Añadir al Carrito</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Banner de Ancho Completo (Full-Bleed CTA) */}
      <section className="w-full bg-primary py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 text-center md:text-left relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
              Únete al Club <br /><span className="text-accent">Distribución</span>
            </h2>
            <p className="text-white/80 text-xl font-medium max-w-md">
              Accede a precios mayoristas, despacho express y asesoría veterinaria técnica para tu negocio.
            </p>
            <Button className="rounded-full bg-accent text-accent-foreground font-black px-16 h-18 text-2xl shadow-2xl hover:scale-105 transition-all">
              Registrar Negocio
            </Button>
          </div>
          <div className="relative h-[500px] hidden md:block">
            <Image src="https://picsum.photos/seed/distrib/800/600" alt="Club" fill className="object-contain drop-shadow-2xl translate-x-10" />
          </div>
        </div>
      </section>

      {/* 9. Prueba Social (Testimonios) */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-16">
          <div className="flex justify-center -space-x-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={cn(
                "w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-muted shadow-lg transition-all duration-500",
                i === 3 ? "scale-125 z-10 border-primary/20" : "opacity-40"
              )}>
                <Image src={`https://picsum.photos/seed/testi-${i}/120/120`} alt="user" width={80} height={80} />
              </div>
            ))}
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {[1,2,3].map(i => (
                <CarouselItem key={i}>
                  <div className="space-y-8">
                    <p className="text-2xl md:text-4xl font-medium italic text-foreground leading-relaxed px-12">
                      "Excelente servicio de distribución. Los productos siempre llegan frescos y en el tiempo acordado. Mi tienda ha crecido un 40% gracias a su soporte técnico."
                    </p>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-foreground">Carolina Méndez</h4>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Dueña de PetShop "El Refugio"</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-16 w-16 bg-black text-white hover:bg-primary border-none shadow-xl" />
            <CarouselNext className="h-16 w-16 bg-black text-white hover:bg-primary border-none shadow-xl" />
          </Carousel>
        </div>
      </section>

      {/* 10. Noticias y Blog (Tarjetas Fotográficas Orgánicas) */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Actualidad y Nutrición</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Nuestro <span className="text-primary">Blog</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { t: 'Cómo optimizar el stock en tu Pet Shop', c: 'Negocios', img: 'https://picsum.photos/seed/blog1/800/600' },
            { t: 'Tendencias en nutrición animal 2024', c: 'Salud', img: 'https://picsum.photos/seed/blog2/800/600' },
            { t: 'El impacto de los snacks naturales', c: 'Bienestar', img: 'https://picsum.photos/seed/blog3/800/600' }
          ].map((post, i) => (
            <div key={i} className="flex flex-col gap-6 group cursor-pointer">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden relative shadow-lg">
                <Image src={post.img} alt={post.t} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <Badge className="absolute bottom-6 left-6 bg-accent text-accent-foreground font-black border-none rounded-full px-6 py-2.5 text-[10px] uppercase tracking-widest shadow-xl">
                  {post.c}
                </Badge>
              </div>
              <div className="space-y-4 px-2">
                <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">{post.t}</h3>
                <Link href="#" className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] hover:translate-x-2 transition-transform">
                  Leer más <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Sección de Acordeón (FAQ) */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-8 text-left">
          <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Centro de Soporte</span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-none">Preguntas <br /><span className="text-primary">Frecuentes</span></h2>
          <p className="text-muted-foreground text-xl font-medium leading-relaxed">Resolvemos tus dudas sobre procesos de compra mayorista, tiempos de entrega y métodos de pago certificados.</p>
          <Button variant="outline" className="rounded-full border-2 border-primary/10 text-primary font-black px-12 h-16 text-lg hover:border-primary">Ver Centro de Ayuda</Button>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            { q: '¿Cuál es el monto mínimo de compra?', a: 'Para precios de distribución, el pedido mínimo es de $150.000 netos.' },
            { q: '¿Despachan a regiones fuera de la RM?', a: 'Sí, contamos con alianzas logísticas para llegar a todo Chile con tarifas preferenciales.' },
            { q: '¿Tienen soporte veterinario para tiendas?', a: 'Contamos con un equipo técnico especializado para asesorar tu catálogo de productos.' },
            { q: '¿Cuáles son los plazos de entrega?', a: 'En Santiago entregamos en 24-48 horas hábiles tras la confirmación del pago.' }
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-none">
              <AccordionTrigger className="flex gap-4 p-8 bg-white border border-black/5 rounded-2xl hover:no-underline data-[state=open]:bg-primary data-[state=open]:text-white transition-all shadow-sm font-black text-lg text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="p-8 text-muted-foreground text-lg font-medium bg-white rounded-b-2xl border border-t-0 border-black/5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 12. Barra de Confianza (Trust Bar) */}
      <section className="py-24 bg-[#FEF9F3] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: <Clock className="w-8 h-8" />, t: 'Entrega Flash', s: 'Comprando antes de las 14:00' },
            { icon: <Truck className="w-8 h-8" />, t: 'Envío Gratis', s: 'Sobre $50.000 netos' },
            { icon: <ShieldCheck className="w-8 h-8" />, t: 'Garantía MyDog', s: 'Productos certificados' },
            { icon: <Headphones className="w-8 h-8" />, t: 'Soporte 24/7', s: 'Asistencia garantizada' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-primary shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="font-black text-foreground text-lg">{item.t}</h4>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. Galería de Instagram */}
      <section className="w-full flex overflow-hidden">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="flex-1 aspect-square relative group cursor-pointer overflow-hidden border-r border-white last:border-0">
            <Image src={`https://picsum.photos/seed/ig-${i}/500/500`} alt="ig" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Instagram className="text-white w-12 h-12" />
            </div>
          </div>
        ))}
      </section>

      {/* 14. Footer Masivo */}
      <footer className="w-full">
        {/* Top Row (Suscripción) */}
        <div className="bg-[#FEF9F3] py-24 text-center border-t border-black/5">
          <div className="max-w-4xl mx-auto px-4 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Mantente al día con <span className="text-primary">MyDog</span></h2>
              <p className="text-muted-foreground font-medium text-xl">Recibe listas de precios actualizadas y novedades exclusivas para tu negocio.</p>
            </div>
            <div className="relative max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full h-20 px-3 shadow-xl border border-black/5">
                <input type="email" placeholder="Tu correo electrónico empresarial" className="flex-1 h-full bg-transparent outline-none px-10 font-bold text-sm text-foreground" />
                <Button className="rounded-full bg-primary text-white font-black px-12 h-14 text-lg shadow-lg">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer (Super-Card) */}
        <div className="bg-primary text-white py-24 px-4 md:px-8 rounded-t-[4rem] mx-4 -mt-10 relative z-20 shadow-2xl">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-20">
            <div className="md:col-span-2 space-y-10">
              <Link href="/" className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <Dog className="w-10 h-10 text-white" />
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="font-black text-4xl tracking-tighter leading-none uppercase">MyDog</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Distribuidora</span>
                </div>
              </Link>
              <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm">
                Liderando la nutrición y el bienestar animal en Chile desde 2008. Pasión, compromiso y calidad en cada despacho.
              </p>
              <div className="flex gap-4">
                {[Instagram].map((Icon, i) => (
                  <Link key={i} href="#" className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-primary transition-all">
                    <Icon className="w-6 h-6" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] text-accent">Navegación</h4>
              <ul className="space-y-6 text-sm font-black text-white/70">
                {['Home', 'Tienda', 'Ofertas', 'Blog'].map(l => (
                  <li key={l}><Link href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div className="space-y-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] text-accent">Información</h4>
              <ul className="space-y-6 text-sm font-black text-white/70">
                {['¿Quiénes somos?', 'Términos', 'Envíos', 'FAQ'].map(l => (
                  <li key={l}><Link href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div className="space-y-10">
              <h4 className="font-black text-xs uppercase tracking-[0.3em] text-accent">Contacto</h4>
              <ul className="space-y-8 text-sm font-black text-white/70">
                <li className="flex items-start gap-4">
                  <span className="text-2xl">📍</span> 
                  <span>La Cisterna, Región Metropolitana, Chile</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-2xl">📞</span>
                  <span>+56 9 1234 5678</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
            <p>© 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS.</p>
            <div className="flex gap-12 opacity-30 grayscale hover:opacity-100 transition-opacity">
              <div className="bg-white px-5 py-2 rounded-lg text-black font-black">VISA</div>
              <div className="bg-white px-5 py-2 rounded-lg text-black font-black">MASTERCARD</div>
              <div className="bg-white px-5 py-2 rounded-lg text-black font-black">WEBPAY</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
