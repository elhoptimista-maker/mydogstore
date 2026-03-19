
import Image from 'next/image';
import { Instagram } from 'lucide-react';

/**
 * @fileOverview Galería de Instagram siguiendo el punto 13 del PRD.
 */

export default function InstagramGallery() {
  return (
    <section className="w-full pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">@MyDog_Distribuidora</span>
          <h2 className="text-3xl font-black tracking-tighter">Síguenos en <span className="text-primary">Instagram</span></h2>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
          <Instagram className="w-6 h-6" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-square relative overflow-hidden group">
            <Image 
              src={`https://picsum.photos/seed/insta${i}/600/600`} 
              alt={`Instagram ${i}`} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="dog photo"
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Instagram className="text-white w-8 h-8 scale-0 group-hover:scale-100 transition-transform duration-500" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
