import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/mock-db';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center px-4 md:px-8 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/happy-dog/1920/1080"
            alt="Perro feliz en Chile"
            fill
            className="object-cover brightness-[0.85]"
            priority
            data-ai-hint="happy dog"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-2xl text-white space-y-6">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-accent-foreground">
            <Sparkles className="w-3 h-3 fill-current" />
            Nuevo: Asesor IA para tu peludo
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
            Solo lo <span className="text-accent underline decoration-4 underline-offset-8">mejor</span> para tu regalón.
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-lg">
            Descubre productos premium seleccionados para la salud y felicidad de tu perro en Chile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/productos">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-lg font-bold shadow-xl shadow-primary/20">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">Favoritos de la Jauría</h2>
            <p className="text-muted-foreground font-medium">Lo más pedido por los regalones chilenos.</p>
          </div>
          <Link href="/productos" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="md:hidden pt-4">
          <Link href="/productos">
            <Button variant="outline" className="w-full h-12 rounded-xl border-primary text-primary font-bold">
              Ver colección completa
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}