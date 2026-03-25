import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays } from 'lucide-react';

/**
 * @fileOverview Sección de Blog y Noticias refinada.
 * Implementa tarjetas orgánicas con una jerarquía de lectura clara y micro-animaciones.
 */

const BLOG_POSTS = [
  {
    title: '5 Consejos para la nutrición de tu cachorro en verano',
    category: 'Nutrición',
    date: '12 Oct, 2024',
    image: 'https://picsum.photos/seed/blog-pet-1/800/600',
    excerpt: 'Descubre cómo mantener a tu pequeño amigo hidratado y nutrido durante las olas de calor...'
  },
  {
    title: '¿Por qué mi gato no toma suficiente agua? Tips técnicos',
    category: 'Salud Felina',
    date: '10 Oct, 2024',
    image: 'https://picsum.photos/seed/blog-pet-2/800/600',
    excerpt: 'El comportamiento felino puede ser un misterio. Te explicamos la importancia de las fuentes de agua...'
  },
  {
    title: 'Juguetes ideales para razas grandes y mordidas fuertes',
    category: 'Accesorios',
    date: '08 Oct, 2024',
    image: 'https://picsum.photos/seed/blog-pet-3/800/600',
    excerpt: 'Si tu perro destruye todo en minutos, esta guía de materiales certificados es para ti.'
  }
];

export default function BlogSection() {
  return (
    <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/[0.03] pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            📖 El blog de los expertos
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
            Mundo <span className="text-primary">MyDog</span>
          </h2>
          <p className="text-sm font-medium text-muted-foreground">Consejos técnicos y novedades del bienestar animal.</p>
        </div>
        <Link href="#" className="group inline-flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-all">
          Ver todas las noticias 
          <div className="w-10 h-10 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
        {BLOG_POSTS.map((post, i) => (
          <div key={i} className="flex flex-col gap-6 group cursor-pointer">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-black/[0.03] bg-muted">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <Badge className="absolute top-6 left-6 bg-secondary text-primary border-none rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-lg">
                {post.category}
              </Badge>
            </div>
            <div className="space-y-4 px-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <CalendarDays className="w-3.5 h-3.5" />
                {post.date}
              </div>
              <h3 className="text-2xl font-black text-foreground leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                  Leer artículo completo <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
