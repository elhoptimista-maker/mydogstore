import Image from 'next/image';
import { Instagram, Sparkles } from 'lucide-react';

/**
 * @fileOverview Galería de Instagram refinada.
 * Implementa un muro fotográfico denso con efectos de cristal sobre las imágenes.
 */

export default function InstagramGallery() {
  return (
    <section className="w-full pt-16 md:pt-24 border-t border-black/[0.03]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
            📸 Comunidad Digital
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
            Únete a nuestra <span className="text-primary">Manada Online</span>
          </h2>
          <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-widest">Sigue nuestro día a día en @MyDog_Distribuidora</p>
        </div>
        <a 
          href="https://www.instagram.com/mydog_distribuidora" 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-14 px-10 rounded-full bg-black text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
        >
          <Instagram className="w-5 h-5" /> Seguir en Instagram
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 md:gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-square relative overflow-hidden group bg-muted">
            <Image 
              src={`https://picsum.photos/seed/mydog-insta-${i}/600/600`} 
              alt={`Comunidad MyDog ${i}`} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 16vw"
              data-ai-hint="happy pet"
            />
            {/* Efecto de cristal en hover */}
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="text-[8px] font-black text-white uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">Ver publicación</span>
            </div>
            
            {/* Badge de "Like" simulado */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
               <Sparkles className="w-3 h-3 text-secondary fill-current" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
