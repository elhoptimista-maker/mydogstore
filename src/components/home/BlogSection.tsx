
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

/**
 * @fileOverview Sección de Noticias y Blog siguiendo el punto 10 del PRD.
 */

const BLOG_POSTS = [
  {
    title: '5 Consejos para la nutrición de tu cachorro',
    category: 'Nutrición',
    date: '12 Oct',
    image: 'https://picsum.photos/seed/blog1/800/600'
  },
  {
    title: '¿Por qué mi gato no toma suficiente agua?',
    category: 'Salud',
    date: '10 Oct',
    image: 'https://picsum.photos/seed/blog2/800/600'
  },
  {
    title: 'Juguetes ideales para razas grandes',
    category: 'Accesorios',
    date: '08 Oct',
    image: 'https://picsum.photos/seed/blog3/800/600'
  }
];

export default function BlogSection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/5 pb-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Mundo MyDog</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Nuestro <span className="text-primary">Blog</span></h2>
        </div>
        <Link href="#" className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
          Ver todas las noticias <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {BLOG_POSTS.map((post, i) => (
          <div key={i} className="flex flex-col gap-6 group cursor-pointer">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden relative shadow-xl shadow-black/[0.03]">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint="pet blog"
              />
              <Badge className="absolute bottom-6 left-6 bg-accent text-primary border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
                {post.category}
              </Badge>
            </div>
            <div className="space-y-3 px-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{post.date}, 2024</span>
              <h3 className="text-2xl font-black text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <Link href="#" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                Leer más <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
