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
  Mail
} from 'lucide-react';
import { getProducts, Product } from '@/lib/mock-db';
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
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      
      {/* 2. Bloque Hero (Impresión Inicial) */}
      <section className="bg-[#FEF9F3] w-full pt-10 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
            <Badge className="bg-primary/10 text-primary border-none px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              🐾 Bienestar animal garantizado
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter">
              Nutrición Premium <br /> para tu <span className="text-primary italic">Mascota</span>.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Distribuidora líder en Chile con más de 15 años de trayectoria. Calidad certificada para los que más quieres.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/catalogo">
                <Button size="lg" className="h-16 rounded-full bg-primary text-white font-black px-10 text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all gap-3">
                  Ir al Catálogo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-muted">
                    <Image src={`https://picsum.photos/seed/${i+10}/100/100`} alt="user" width={40} height={40} />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span className="text-primary font-black">100K+</span> Clientes Felices en todo Chile
              </p>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-125 animate-pulse" />
            <Image
              src="https://picsum.photos/seed/mydog-hero/800/1000"
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

      {/* 3. Navegación por Píldoras (Categorías) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Nuestros Amigos</span>
          <h2 className="text-4xl font-black tracking-tight text-foreground">
            Explora por <span className="text-primary">Mascota</span>
          </h2>
        </div>
        <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-14 no-scrollbar pb-10 snap-x">
          {[
            { name: 'Perros', emoji: '🐶', color: 'bg-primary/5' },
            { name: 'Gatos', emoji: '🐱', color: 'bg-accent/10' },
            { name: 'Aves', emoji: '🦜', color: 'bg-blue-50' },
            { name: 'Conejo', emoji: '🐰', color: 'bg-rose-50' },
            { name: 'Roedor', emoji: '🐹', color: 'bg-amber-50' },
            { name: 'Peces', emoji: '🐠', color: 'bg-indigo-50' },
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer snap-center shrink-0">
              <div className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500",
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
      </section>

      {/* 4. Super-Cards Promocionales */}
      <section className="py-10 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] relative overflow-hidden p-10 flex items-center shadow-sm group hover:shadow-xl transition-all">
          <div className="space-y-6 flex-1 z-10">
            <Badge className="bg-accent/20 text-accent-foreground border-none rounded-full px-3 py-1 text-[10px] font-black uppercase">Nueva Colección</Badge>
            <h3 className="text-4xl font-black tracking-tighter leading-none">Camas <span className="text-primary">Ortopédicas</span></h3>
            <Button className="rounded-full bg-primary font-black px-8">Ver Ahora</Button>
          </div>
          <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-700">
            <Image src="https://picsum.photos/seed/bed/400/400" alt="Cama" fill className="object-contain" />
          </div>
        </div>
        <div className="bg-accent rounded-[2rem] relative overflow-hidden p-10 flex items-center shadow-sm group hover:shadow-xl transition-all">
          <div className="space-y-6 flex-1 z-10">
            <Badge className="bg-primary/20 text-primary border-none rounded-full px-3 py-1 text-[10px] font-black uppercase">Oferta Mensual</Badge>
            <h3 className="text-4xl font-black tracking-tighter leading-none text-accent-foreground">Alimento <span className="text-white">Natural</span></h3>
            <Button className="rounded-full bg-white text-primary font-black px-8">Explorar</Button>
          </div>
          <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-700">
            <Image src="https://picsum.photos/seed/foodbag/400/400" alt="Alimento" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* 5. Grilla de Productos Estándar */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="flex flex-row justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Selección Premium</span>
            <h2 className="text-4xl font-black tracking-tight text-foreground">Lo más <span className="text-primary">Popular</span></h2>
          </div>
          <Button variant="outline" className="rounded-full font-black border-2 border-primary/10 text-primary px-8 hover:bg-primary hover:text-white transition-all">
            Ver Todos
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Sección de Oferta Relámpago */}
      <section className="bg-[#FDF8F3] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-center lg:text-left">
          <div className="hidden lg:block relative h-80">
            <Image src="https://picsum.photos/seed/cat1/600/600" alt="Cat" fill className="object-contain" />
          </div>
          <div className="space-y-10 flex flex-col items-center">
            <div className="space-y-2">
              <span className="text-accent-foreground font-black uppercase tracking-[0.3em] text-xs">Oferta Relámpago</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-none">Hasta <span className="text-primary">50% OFF</span></h2>
            </div>
            {/* Cuenta Regresiva */}
            <div className="flex gap-4">
              {[
                { val: '02', label: 'Días' },
                { val: '14', label: 'Hrs' },
                { val: '45', label: 'Min' },
                { val: '12', label: 'Seg' }
              ].map((item, i) => (
                <div key={i} className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border border-black/5 animate-in zoom-in duration-500 delay-150">
                  <span className="text-2xl font-black text-primary leading-none">{item.val}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
            <Button className="rounded-full bg-primary text-white font-black px-12 h-14 text-lg shadow-xl hover:scale-105 transition-all">
              Aprovechar Ahora
            </Button>
          </div>
          <div className="hidden lg:block relative h-80">
            <Image src="https://picsum.photos/seed/dog2/600/600" alt="Dog" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* 7. Tarjetas de Producto Horizontales (Deals of the Day) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <h2 className="text-4xl font-black tracking-tight text-foreground text-center">Ofertas del <span className="text-primary">Día</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <div key={i} className="flex-row bg-white rounded-[2rem] p-6 border border-border/50 gap-6 flex items-center shadow-sm hover:shadow-xl transition-all group">
              <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-2xl bg-muted/30">
                <Image src={product.media.main_image} alt={product.metadata.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-1 text-accent">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-black text-foreground">4.9</span>
                </div>
                <h4 className="font-black text-sm text-foreground line-clamp-2 leading-snug">{product.metadata.name}</h4>
                <div className="text-xl font-black text-primary">${product.financials.pricing.base_price.toLocaleString('es-CL')}</div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Vendido: 65</span>
                    <span>Quedan: 35</span>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-muted text-primary font-black text-xs hover:bg-primary hover:text-white transition-all">Agregar</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Banner de Ancho Completo */}
      <section className="w-full bg-primary py-20 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Únete al Club <br /><span className="text-accent">MyDog</span> Beneficios
            </h2>
            <p className="text-white/70 text-lg font-medium max-w-md mx-auto md:mx-0">
              Suscripciones mensuales, descuentos exclusivos y envíos programados para que nunca les falte nada.
            </p>
            <Button className="rounded-full bg-accent text-accent-foreground font-black px-12 h-16 text-xl shadow-2xl hover:scale-105 transition-all">
              Registrarme Gratis
            </Button>
          </div>
          <div className="relative h-[400px] hidden md:block">
            <Image src="https://picsum.photos/seed/fullbanner/800/600" alt="Club" fill className="object-contain drop-shadow-2xl" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
      </section>

      {/* 9. Prueba Social (Testimonios) */}
      <section className="py-20 bg-[#F6F6F6] text-center space-y-12 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
          <div className="flex justify-center -space-x-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={cn(
                "w-14 h-14 rounded-full border-4 border-[#F6F6F6] overflow-hidden bg-muted transition-all duration-500",
                i === 3 ? "scale-125 z-10 shadow-xl border-primary/20" : "opacity-40"
              )}>
                <Image src={`https://picsum.photos/seed/u${i}/100/100`} alt="user" width={56} height={56} />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <p className="text-2xl md:text-3xl font-medium italic text-foreground leading-relaxed">
              "La mejor distribuidora que he probado. Mis perros aman sus snacks y el despacho siempre llega a tiempo. ¡100% recomendados!"
            </p>
            <div>
              <h4 className="text-lg font-black text-foreground">Valentina Ríos</h4>
              <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Dueña de 3 Golden Retrievers</p>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-4 md:left-10 -translate-y-1/2">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white shadow-md text-primary"><ArrowRight className="w-5 h-5 rotate-180" /></Button>
        </div>
        <div className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white shadow-md text-primary"><ArrowRight className="w-5 h-5" /></Button>
        </div>
      </section>

      {/* 10. Noticias y Blog (Orgánico) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Aprende con Nosotros</span>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Nuestro <span className="text-primary">Blog</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { t: '5 Tips para el cuidado de cachorros', c: 'Cuidado' },
            { t: 'Importancia de la nutrición natural', c: 'Salud' },
            { t: 'Cómo elegir la cama perfecta', c: 'Hogar' }
          ].map((post, i) => (
            <div key={i} className="flex flex-col gap-6 group cursor-pointer">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <Image src={`https://picsum.photos/seed/post${i}/600/450`} alt={post.t} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <Badge className="absolute bottom-4 left-4 bg-accent text-accent-foreground font-black border-none rounded-full px-4 py-1.5 text-[10px] uppercase">
                  {post.c} • 12 May
                </Badge>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{post.t}</h3>
                <Link href="#" className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                  Leer más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FAQ & Acordeón */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Centro de Ayuda</span>
            <h2 className="text-5xl font-black tracking-tighter text-foreground leading-none">Preguntas <span className="text-primary">Frecuentes</span></h2>
            <p className="text-muted-foreground text-lg font-medium">Todo lo que necesitas saber sobre envíos, medios de pago y nuestras marcas.</p>
            <Button variant="outline" className="rounded-full border-2 border-primary/10 text-primary font-black px-10">Ver todas las dudas</Button>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: '¿Realizan envíos a todo Chile?', a: 'Sí, despachamos a todas las regiones a través de Starken, Chilexpress y transporte propio en Santiago.' },
              { q: '¿Cómo puedo comprar al por mayor?', a: 'Debes registrarte en nuestra sección B2B con tu RUT de empresa para acceder a la lista de precios mayorista.' },
              { q: '¿Qué medios de pago aceptan?', a: 'Aceptamos Webpay Plus (Crédito/Débito), Transferencia Bancaria y Mercado Pago.' },
              { q: '¿Los despachos en Santiago son gratuitos?', a: 'Sí, por compras superiores a $50.000 el envío es totalmente gratis en la Región Metropolitana.' }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none">
                <AccordionTrigger className="flex gap-4 p-6 bg-muted/20 rounded-2xl hover:no-underline data-[state=open]:bg-primary data-[state=open]:text-white transition-all group">
                  <span className="text-sm font-black text-left uppercase tracking-tight">{item.q}</span>
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
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8 border-t border-black/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { i: <Truck />, t: 'Envío Express', s: 'Despacho mismo día comprando antes de las 14:00' },
            { i: <ShieldCheck />, t: 'Pago Seguro', s: 'Transacciones 100% protegidas por Webpay' },
            { i: <Headphones />, t: 'Soporte Vital', s: 'Asistencia experta de lunes a domingo' },
            { i: <CheckCircle2 />, t: 'Calidad Garantizada', s: 'Solo marcas certificadas y frescas' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-500 shrink-0">
                {item.i}
              </div>
              <div className="flex flex-col">
                <h4 className="font-black text-foreground uppercase text-xs tracking-tight">{item.t}</h4>
                <p className="text-[10px] font-bold text-muted-foreground leading-tight uppercase tracking-wider">{item.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. Galería de Instagram */}
      <section className="w-full flex overflow-hidden border-y border-black/5">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="flex-1 aspect-square relative group cursor-pointer overflow-hidden">
            <Image src={`https://picsum.photos/seed/ig${i}/400/400`} alt="ig" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Instagram className="text-white w-8 h-8" />
            </div>
          </div>
        ))}
      </section>

      {/* 14. Footer Masivo */}
      <footer className="w-full">
        {/* Suscripción */}
        <div className="bg-[#FEF9F3] py-20">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-10">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Newsletter</span>
              <h2 className="text-4xl font-black tracking-tight text-foreground">Mantente al día con <span className="text-primary">MyDog</span></h2>
              <p className="text-muted-foreground font-medium">Recibe ofertas exclusivas, consejos de expertos y novedades antes que todos.</p>
            </div>
            <div className="relative max-w-md mx-auto group">
              <div className="relative flex items-center bg-white rounded-full h-16 px-2 shadow-lg group-focus-within:ring-4 group-focus-within:ring-primary/10 transition-all border border-black/5">
                <Mail className="w-5 h-5 text-primary ml-5 shrink-0" />
                <input type="email" placeholder="tu@email.com" className="flex-1 h-full bg-transparent outline-none px-4 font-bold text-sm text-foreground" />
                <Button className="rounded-full bg-primary text-white font-black px-8 h-12 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="bg-primary text-white py-20 px-4 md:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2 space-y-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-white/20 transition-all">
                  <Dog className="w-8 h-8 text-white" />
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="font-black text-2xl tracking-tighter leading-none">MyDog</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
                </div>
              </Link>
              <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">
                Pasión por el bienestar animal. Liderando la distribución de nutrición premium en Chile desde 2008 con compromiso y cercanía.
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-primary transition-all">
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-accent">Navegación</h4>
              <ul className="space-y-4 text-sm font-bold text-white/70">
                {['Catálogo Completo', 'Venta Mayorista', 'Nuestras Marcas', 'Blog de Nutrición'].map(l => (
                  <li key={l}><Link href="#" className="hover:text-white hover:underline transition-all">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-accent">Información</h4>
              <ul className="space-y-4 text-sm font-bold text-white/70">
                {['¿Quiénes somos?', 'Términos y Condiciones', 'Políticas de Envío', 'Preguntas Frecuentes'].map(l => (
                  <li key={l}><Link href="#" className="hover:text-white hover:underline transition-all">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-accent">Contacto</h4>
              <ul className="space-y-5 text-sm font-bold text-white/70">
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
          
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
              © 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-black text-black">WEBPAY</div>
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-black text-black">VISA</div>
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-black text-black">MASTERCARD</div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
