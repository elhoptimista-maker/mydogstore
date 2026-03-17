

import { getProductById } from '@/lib/mock-db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart, ShieldCheck, Heart, Share2, Truck, RefreshCw, Scale, Dog, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Galería de Imágenes */}
        <div className="space-y-6">
          <div className="aspect-square relative rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-black/5 border border-border/50 group">
            <Image
              src={product.media.main_image}
              alt={product.metadata.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              data-ai-hint={product.media.imageHint}
            />
          </div>
        </div>

        {/* Información Técnica y Venta */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="px-4 py-1.5 bg-primary text-white border-none text-[10px] font-black uppercase tracking-widest rounded-full">
                {product.attributes.brand} | {product.attributes.category}
              </Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-border/50 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-border/50">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tighter">
              {product.metadata.name}
            </h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-secondary">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 fill-current ${i > 4 ? 'text-gray-200' : ''}`} />
                ))}
                <span className="ml-2 font-black text-foreground">4.8</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm font-medium text-muted-foreground tracking-tight">SKU: {product.metadata.sku}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Precio Distribución</span>
            <div className="text-5xl font-black text-primary tracking-tighter">
              ${product.financials.pricing.base_price.toLocaleString('es-CL')}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: <Scale className="w-4 h-4" />, label: "Peso", val: `${product.attributes.weight_kg}kg` },
               { icon: <Dog className="w-4 h-4" />, label: "Etapa", val: product.attributes.life_stage },
               { icon: <Briefcase className="w-4 h-4" />, label: "Formato", val: product.attributes.format },
               { icon: <Dog className="w-4 h-4" />, label: "Especie", val: product.attributes.species }
             ].map((attr, i) => (
               <div key={i} className="bg-muted/30 p-3 rounded-2xl space-y-1">
                 <div className="flex items-center gap-2 text-primary">
                    {attr.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{attr.label}</span>
                 </div>
                 <p className="font-bold text-sm">{attr.val}</p>
               </div>
             ))}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.content.short_description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button className="h-16 rounded-3xl bg-primary text-white font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              <ShoppingCart className="w-6 h-6" /> Añadir al Carrito
            </Button>
            <Button variant="outline" className="h-16 rounded-3xl border-secondary text-secondary hover:bg-secondary/5 font-black text-lg gap-3">
              Suscríbete y Ahorra 10%
            </Button>
          </div>

          <Separator className="bg-border/50 my-4" />

          {/* Beneficios Corporativos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Truck className="w-5 h-5" />, text: "Despacho Express" },
              { icon: <ShieldCheck className="w-5 h-5" />, text: "Pago 100% Seguro" },
              { icon: <RefreshCw className="w-5 h-5" />, text: "Garantía MyDog" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 bg-muted/30 rounded-2xl text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
