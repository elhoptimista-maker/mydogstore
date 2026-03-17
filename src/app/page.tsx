import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Bird, Search, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/mock-db';

export default async function Home() {
  const products = await getProducts();

  const categories = [
    { name: 'Perros', icon: <Dog className="w-6 h-6" />, color: 'bg-primary/10 text-primary' },
    { name: 'Gatos', icon: <Cat className="w-6 h-6" />, color: 'bg-secondary/20 text-secondary-foreground' },
    { name: 'Aves', icon: <Bird className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Higiene', icon: <Sparkles className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar - Fixed style */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
          <input 
            type="text" 
            placeholder="¿Qué busca tu regalón hoy?" 
            className="w-full h-14 bg-white rounded-full pl-12 pr-4 shadow-sm border-none focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Hero / Promo Banner */}
      <section className="px-4">
        <div className="relative h-44 w-full rounded-3xl overflow-hidden bg-primary shadow-lg shadow-primary/20">
          <div className="absolute inset-0 p-6 flex flex-col justify-center gap-2 z-10">
            <h2 className="text-white text-2xl font-extrabold leading-tight">
              ¡BAKÁN! <br /> <span className="text-secondary">30% OFF</span> en Alimentos
            </h2>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Solo por este fin de semana</p>
            <Button size="sm" className="w-fit mt-2 rounded-full bg-white text-primary font-bold hover:bg-secondary transition-colors">
              Ver Promo
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full">
             <Image
              src="https://picsum.photos/seed/happy-dog-hero/600/400"
              alt="Promo dog"
              fill
              className="object-cover opacity-60"
              data-ai-hint="happy dog"
            />
          </div>
        </div>
      </section>

      {/* Horizontal Categories */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <h3 className="font-bold text-lg">Categorías</h3>
          <Link href="/categorias" className="text-primary text-sm font-bold">Ver todas</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar snap-x">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 snap-center min-w-[80px]">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Destacados para ti</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[2.5rem] p-3 shadow-sm flex flex-col gap-3 group">
              <Link href={`/productos/${product.id}`} className="block relative aspect-square rounded-[2rem] overflow-hidden bg-background">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  data-ai-hint="dog product"
                />
              </Link>
              <div className="px-1 space-y-1">
                <h4 className="text-sm font-bold line-clamp-1">{product.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary font-extrabold text-lg">
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                  <Button 
                    size="icon" 
                    className="h-10 w-10 rounded-2xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-all shadow-md shadow-secondary/20"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}