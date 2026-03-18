
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
  CheckCircle2,
  Star,
  Plus,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  ShoppingCart,
  Minus
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
      
      {/* 2. Bloque Hero (Impresión Inicial) */}
      <section className="bg-[#FEF9F3] w-full pt-10 pb-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              🐾 Bienestar animal garantizado
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter">
              Comida Premium <br /> para tu <span className="text-primary">Mascota</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Distribuidora líder en Chile con más de 15 años de trayectoria. Calidad certificada para los que más quieres.
            </p>
            <Button size="lg" className="h-16 rounded-full bg-primary text-white font-black px-10 text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all gap-3">
              Ir al Catálogo <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-muted">
                    <Image src={`https://picsum.photos/seed/${i+10}/100/100`} alt="usuario" width={40} height={40} />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span className="text-primary font-black">100K+</span> Clientes Felices
              </p>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <Image
              src="https://picsum.photos/seed/pet-hero/800/1000"
              alt="Mascota Feliz"
              width={800}
              height={1000}
              className="object-contain relative z-10 drop-shadow-2xl translate-y-10"
              priority
              data-ai-hint="happy dog"
            />
          </div>
        </div>
      </section>

      {/* 3. Navegación por Píldoras (Categorías Destacadas) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Explora nuestra tienda</span>
          <h2 className="text-4xl font-black tracking-tight text-foreground">
            Compra por <span className="text-primary">Categoría</span>
          </h2>
        </div>
        <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-14 no-scrollbar pb-4 snap-x">
          {[
            { name: 'Perros', emoji: '🐶' },
            { name: 'Gatos', emoji: '🐱' },
            { name: 'Aves', emoji: '🦜' },
            { name: 'Conejos', emoji: '🐰' },
            { name: 'Roedores', emoji: '🐹' },
            { name: 'Peces', emoji: '🐠' },
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer snap-center shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center transition-all duration-300 group-hover:bg-primary/5 group-hover:shadow-lg">
                <span className="text-5xl md:text-6xl">{cat.emoji}</span>
              </div>
              <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Super-Cards Promocionales (Banners Bicolores) */}
      <section className="py-10 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] relative overflow-hidden p-10 flex items-center shadow-sm hover:shadow-md transition-all group">
          <div className="space-y-6 flex-1 z-10">
            <Badge className="bg-yellow-400/20 text-yellow-800 border-none rounded-full px-3 py-1 text-[10px] font-black uppercase">Nueva Temporada</Badge>
            <h3 className="text-4xl font-black tracking-tighter leading-none text-foreground">Accesorios <br /><span className="text-primary">Premium</span></h3>
            <Button className="rounded-full bg-primary font-black px-8 h-12">Ver Colección</Button>
          </div>
          <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-500">
            <Image src="https://picsum.photos/seed/acc-promo/400/400" alt="Promo 1" fill className="object-contain" />
          </div>
        </div>
        <div className="bg-accent rounded-[2.5rem] relative overflow-hidden p-10 flex items-center shadow-sm hover:shadow-md transition-all group">
          <div className="space-y-6 flex-1 z-10 text-accent-foreground">
            <Badge className="bg-primary/20 text-primary border-none rounded-full px-3 py-1 text-[10px] font-black uppercase">Oferta Imperdible</Badge>
            <h3 className="text-4xl font-black tracking-tighter leading-none">Nutrición <br /><span className="text-primary">Especializada</span></h3>
            <Button className="rounded-full bg-white text-primary font-black px-8 h-12 hover:bg-primary hover:text-white transition-colors">Ver Ofertas</Button>
          </div>
          <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-500">
            <Image src="https://picsum.photos/seed/food-promo/400/400" alt="Promo 2" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* 5. Grilla de Productos Estándar */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="flex flex-row justify-between items-end">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Favoritos de la comunidad</span>
            <h2 className="text-4xl font-black tracking-tight text-foreground">Lo más <span className="text-primary">Vendido</span></h2>
          </div>
          <Button variant="outline" className="rounded-full font-black border-2 px-8 h-12 border-primary/10 hover:border-primary transition-all">Ver Todos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Sección de Oferta Relámpago (Flash Deal) */}
      <section className="bg-[#FDF8F3] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-center lg:text-left">
          <div className="hidden lg:block relative h-80">
            <Image src="https://picsum.photos/seed/cat-flash/600/600" alt="Cat Flash" fill className="object-contain" />
          </div>
          <div className="space-y-10 flex flex-col items-center">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Venta Relámpago</h4>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-none">Hasta <span className="text-primary">50% DCTO</span></h2>
            </div>
            <div className="flex gap-4">
              {[
                { val: '02', label: 'Días' },
                { val: '14', label: 'Hrs' },
                { val: '45', label: 'Min' },
                { val: '12', label: 'Seg' }
              ].map((item, i) => (
                <div key={i} className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-sm border border-black/5">
                  <span className="text-xl font-black text-primary leading-none">{item.val}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">{item.label}</span>
                </div>
              ))}
            </div>
            <Button className="rounded-full bg-primary text-white font-black px-12 h-14 text-lg shadow-xl hover:scale-105 transition-all">
              Aprovechar Ahora
            </Button>
          </div>
          <div className="hidden lg:block relative h-80">
            <Image src="https://picsum.photos/seed/dog-flash/600/600" alt="Dog Flash" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* 7. Tarjetas de Producto Horizontales (Deals of the Day) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <h2 className="text-4xl font-black tracking-tight text-foreground text-center">Ofertas del <span className="text-primary">Día</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, i) => (
            <div key={i} className="flex flex-row bg-white rounded-2xl p-4 border border-border gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                <Image src={product.media.main_image} alt={product.metadata.name} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-black text-foreground">4.9</span>
                </div>
                <h4 className="font-bold text-sm text-foreground line-clamp-1">{product.metadata.name}</h4>
                <div className="text-lg font-black text-primary">${product.financials.pricing.base_price.toLocaleString('es-CL')}</div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                    <span>Vendido: 65</span>
                    <span>Quedan: 35</span>
                  </div>
                </div>
                <Button size="sm" className="w-full rounded-full bg-primary text-white font-bold h-8">Agregar</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Banner de Ancho Completo (Full-Bleed CTA) */}
      <section className="w-full bg-primary py-20 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Únete al Club <br /><span className="text-accent">MyDog</span> Distribución
            </h2>
            <p className="text-white/70 text-lg font-medium max-w-md mx-auto md:mx-0">
              Accede a precios mayoristas certificados, envíos programados y soporte técnico especializado para tu negocio.
            </p>
            <Button className="rounded-full bg-accent text-accent-foreground font-black px-12 h-16 text-xl shadow-2xl hover:scale-105 transition-all">
              Registrar mi Negocio
            </Button>
          </div>
          <div className="relative h-[400px] hidden md:block">
            <Image src="https://picsum.photos/seed/club-dist/800/600" alt="Club" fill className="object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* 9. Prueba Social (Testimonios) */}
      <section className="py-24 bg-[#F6F6F6] text-center space-y-12 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-10">
          <div className="flex justify-center -space-x-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={cn(
                "w-16 h-16 rounded-full border-4 border-[#F6F6F6] overflow-hidden bg-muted transition-all duration-500",
                i === 3 ? "scale-125 z-10 shadow-xl border-primary/20" : "opacity-40"
              )}>
                <Image src={`https://picsum.photos/seed/testi-${i}/120/120`} alt="user" width={64} height={64} />
              </div>
            ))}
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {[1,2,3].map(i => (
                <CarouselItem key={i}>
                  <div className="space-y-6">
                    <p className="text-2xl md:text-3xl font-medium italic text-foreground leading-relaxed">
                      "Excelente servicio de distribución. Los productos siempre llegan frescos y en el tiempo acordado. Mi tienda ha crecido gracias a su soporte técnico."
                    </p>
                    <div>
                      <h4 className="text-lg font-black text-foreground">Carolina Méndez</h4>
                      <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Dueña de PetShop "El Refugio"</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-10">
              <CarouselPrevious className="relative translate-y-0 left-0 h-14 w-14 bg-black text-white hover:bg-primary border-none rounded-full shadow-lg" />
              <CarouselNext className="relative translate-y-0 right-0 h-14 w-14 bg-black text-white hover:bg-primary border-none rounded-full shadow-lg" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* 10. Noticias y Blog (Tarjetas Fotográficas - Orgánicas) */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-12 bg-white">
        <div className="flex flex-col items-center text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Actualidad y Nutrición</span>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Nuestro <span className="text-primary">Blog</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { t: 'Cómo optimizar el stock en tu Pet Shop', c: 'Negocios' },
            { t: 'Tendencias en nutrición animal 2024', c: 'Salud' },
            { t: 'El impacto de los snacks naturales', c: 'Bienestar' }
          ].map((post, i) => (
            <div key={i} className="flex flex-col gap-6 group cursor-pointer">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative">
                <Image src={`https://picsum.photos/seed/blog-pet-${i}/800/600`} alt={post.t} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <Badge className="absolute bottom-6 left-6 bg-yellow-400 text-yellow-900 font-black border-none rounded-full px-5 py-2 text-[10px] uppercase shadow-lg">
                  {post.c}
                </Badge>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">{post.t}</h3>
                <Link href="#" className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all">
                  Leer más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Sección de Acordeón (FAQ) */}
      <section className="py-24 bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 lg:sticky lg:top-40">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Centro de Soporte</span>
            <h2 className="text-5xl font-black tracking-tighter text-foreground leading-none">Preguntas <br /><span className="text-primary">Frecuentes</span></h2>
            <p className="text-muted-foreground text-lg font-medium">Resolvemos tus dudas sobre distribución mayorista, tiempos de entrega y métodos de pago.</p>
            <Button variant="outline" className="rounded-full border-2 border-primary/10 text-primary font-black px-10 h-14 mt-4">Ver Centro de Ayuda</Button>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: '¿Cuál es el monto mínimo de compra mayorista?', a: 'El pedido mínimo para precios de distribución comienza desde los $150.000 netos.' },
              { q: '¿Despachan a regiones fuera de la RM?', a: 'Sí, contamos con alianzas logísticas para llegar a todo el territorio nacional chileno.' },
              { q: '¿Tienen soporte veterinario para tiendas?', a: 'Contamos con un equipo técnico especializado para asesorar tu catálogo de productos.' },
              { q: '¿Cuáles son los plazos de entrega?', a: 'En Santiago entregamos en 24-48 horas hábiles tras la confirmación del pedido.' }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none">
                <AccordionTrigger className="flex gap-4 p-6 bg-white border border-black/5 rounded-2xl hover:no-underline data-[state=open]:bg-primary data-[state=open]:text-white transition-all shadow-sm">
                  <span className="text-sm font-bold text-left">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="p-6 text-muted-foreground font-medium bg-white rounded-b-2xl border border-t-0 border-black/5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 12. Barra de Confianza (Trust Bar) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 border-t border-black/5 bg-white mb-10 rounded-[3rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { i: <Truck />, t: 'Despacho Express', s: 'Mismo día antes de las 14:00' },
            { i: <ShieldCheck />, t: 'Garantía Mayorista', s: 'Productos certificados y frescos' },
            { i: <Headphones />, t: 'Soporte 24/7', s: 'Asistencia técnica personalizada' },
            { i: <CheckCircle2 />, t: 'Envío Gratis', s: 'En compras sobre $50.000 netos' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="w-16 h-16 rounded-full bg-yellow-400/10 flex items-center justify-center text-primary group-hover:bg-yellow-400 group-hover:text-yellow-900 transition-all duration-500 shrink-0">
                {item.i}
              </div>
              <div className="flex flex-col">
                <h4 className="font-black text-foreground text-sm leading-tight">{item.t}</h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{item.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. Galería de Instagram */}
      <section className="w-full flex overflow-hidden">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="flex-1 aspect-square relative group cursor-pointer overflow-hidden">
            <Image src={`https://picsum.photos/seed/ig-pet-${i}/500/500`} alt="ig" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Instagram className="text-white w-10 h-10" />
            </div>
          </div>
        ))}
      </section>

      {/* 14. Footer Masivo */}
      <footer className="w-full pt-20">
        {/* Top Row (Suscripción) - Orgánico */}
        <div className="bg-[#FEF9F3] py-24 mb-[-5rem] relative z-20">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Newsletter Mayorista</span>
              <h2 className="text-4xl font-black tracking-tight text-foreground">Mantente informado con <span className="text-primary">MyDog</span></h2>
              <p className="text-muted-foreground font-medium text-lg">Recibe listas de precios actualizadas, ofertas flash y novedades del mercado.</p>
            </div>
            <div className="relative max-w-lg mx-auto">
              <div className="relative flex items-center bg-white rounded-full h-16 px-2 shadow-xl border border-black/5">
                <input type="email" placeholder="contacto@tunegocio.cl" className="flex-1 h-full bg-transparent outline-none px-8 font-bold text-sm text-foreground" />
                <Button className="rounded-full bg-primary text-white font-black px-10 h-12 shadow-md hover:scale-105 active:scale-95 transition-all">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer (Super-Card Verde) */}
        <div className="px-4 md:px-8 pb-10">
          <div className="bg-primary text-white rounded-[3rem] p-12 md:p-24 max-w-7xl mx-auto shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 md:gap-20">
              <div className="lg:col-span-2 space-y-8">
                <Link href="/" className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                    <Dog className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col -space-y-1">
                    <span className="font-black text-3xl tracking-tighter uppercase">MyDog</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
                  </div>
                </Link>
                <p className="text-white/60 text-base font-medium leading-relaxed max-w-sm">
                  Liderando la nutrición y el bienestar animal en Chile desde 2008. Pasión, compromiso y calidad en cada despacho.
                </p>
                <div className="flex gap-4">
                  {[Facebook, Instagram, Twitter].map((Icon, i) => (
                    <Link key={i} href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-primary transition-all border border-white/10">
                      <Icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-10 text-accent">Catálogo</h4>
                <ul className="space-y-5 text-sm font-bold text-white/70">
                  {['Perros', 'Gatos', 'Aves', 'Ofertas Mayoristas'].map(l => (
                    <li key={l}><Link href="#" className="hover:text-white hover:underline transition-all">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-10 text-accent">Empresa</h4>
                <ul className="space-y-5 text-sm font-bold text-white/70">
                  {['Quiénes somos', 'B2B Ventas', 'Despachos', 'Términos'].map(l => (
                    <li key={l}><Link href="#" className="hover:text-white hover:underline transition-all">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-10 text-accent">Contacto</h4>
                <ul className="space-y-6 text-sm font-bold text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-accent">📍</span> 
                    <span>La Cisterna, RM, Chile</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-accent">📞</span>
                    <span>+56 9 1234 5678</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-accent">✉️</span>
                    <span>hola@mydog.cl</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center md:text-left">
                © 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS EN CHILE.
              </p>
              <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="bg-white px-4 py-1.5 rounded-lg text-[10px] font-black text-black">WEBPAY</div>
                <div className="bg-white px-4 py-1.5 rounded-lg text-[10px] font-black text-black">VISA</div>
                <div className="bg-white px-4 py-1.5 rounded-lg text-[10px] font-black text-black">MASTERCARD</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
