
import { fetchProductBySlug } from '@/actions/products';
import { getRelatedProducts } from '@/lib/services/catalog.service';
import { getUpgradeRecommendation } from '@/actions/nudge';
import { MARKET_INTELLIGENCE } from '@/lib/services/ranking.engine';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Scale, Dog, Briefcase, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProductClientControls from '@/components/catalogo/ProductClientControls';
import ProductHeaderActions from '@/components/catalogo/ProductHeaderActions';
import RelatedProductsSlider from '@/components/catalogo/RelatedProductsSlider';
import PredictiveCrossSell from '@/components/catalogo/PredictiveCrossSell';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const product = await fetchProductBySlug(params.slug);
  if (!product) return { title: 'Producto No Encontrado' };
  
  return {
    title: `${product.name} | MyDog Distribuidora`,
    description: product.short_description || `Compra ${product.name} al mejor precio.`
  };
}

export default async function ProductoDetallePage(props: PageProps) {
  const params = await props.params;
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // =====================================================================
  // 🧠 CEREBRO DEL VENDEDOR: Inteligencia de Mercado inyectada en la PDP
  // =====================================================================
  const brandKey = product.brand?.toLowerCase().trim() || '';
  const metrics = MARKET_INTELLIGENCE[brandKey];
  
  // 1. Estrellas dinámicas basadas en el Sentimiento del mercado (1 a 10 dividido en 2)
  const dynamicRating = metrics ? (metrics.sentiment / 2).toFixed(1) : "4.5";
  
  // 2. Transparencia: Precio por Kilo (PPKG)
  const ppkg = product.weight_kg && product.weight_kg > 0 
    ? Math.round(product.sellingPrice / product.weight_kg) 
    : null;

  // 3. Simulamos un contexto de carrito de 1 ítem para que el motor de Nudge (Upgrade) trabaje en el servidor.
  // El Cross-sell (Bundle) ahora es gestionado por un componente cliente para ser reactivo al carrito real.
  const mockCartContext = [{ 
    ...product, 
    priceAtAddition: product.sellingPrice, 
    quantity: 1,
    cartType: 'retail' as const 
  }];
  
  // 4. Consultamos a nuestros Server Actions (Llamadas ultrarrápidas en el servidor)
  const similarProducts = await getRelatedProducts(product);
  const upgradeCandidate = await getUpgradeRecommendation(mockCartContext);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.main_image,
    description: product.short_description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: product.sellingPrice,
      availability: product.currentStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-1 pb-24 space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="space-y-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
           <Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
           <ChevronRight className="w-3 h-3 mx-2 opacity-50" />
           <Link href={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</Link>
           <ChevronRight className="w-3 h-3 mx-2 opacity-50" />
           <span className="text-foreground truncate max-w-[200px] md:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* COLUMNA IZQUIERDA: Imagen */}
          <div className="space-y-6">
            <div className="aspect-square relative rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-black/5 border border-border/50 group flex items-center justify-center">
              {product.currentStock <= 0 && (
                <div className="absolute top-8 left-8 z-10">
                  <Badge className="bg-destructive text-white border-none font-black text-xs uppercase tracking-widest px-4 py-2">Agotado</Badge>
                </div>
              )}
              {/* Etiqueta de Autoridad Nutricional */}
              {metrics && metrics.quality >= 4 && (
                 <div className="absolute top-8 right-8 z-10 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Nutrición Premium</span>
                 </div>
              )}
              <Image src={product.main_image} alt={product.name} fill className="object-contain p-12 transition-transform duration-700 group-hover:scale-105" priority />
            </div>
          </div>

          {/* COLUMNA DERECHA: Información y Conversión */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="px-4 py-1.5 bg-primary text-white border-none text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {product.brand} | {product.category}
                </Badge>
                <ProductHeaderActions product={product} />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tighter">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-secondary">
                  {/* Estrellas Dinámicas basadas en el Sentimiento Real */}
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 fill-current ${i > Math.round(Number(dynamicRating)) ? 'text-gray-200' : ''}`} />
                  ))}
                  <span className="ml-2 font-bold text-foreground">{dynamicRating}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground tracking-tight">SKU: {product.sku}</span>
              </div>
            </div>

            {/* UPSELL INMEDIATO (Si es un producto de baja calidad) */}
            {upgradeCandidate && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-2xl animate-in fade-in shadow-sm">
                 <div className="flex items-start gap-3">
                   <div className="bg-green-600 rounded-full p-1 mt-0.5 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <p className="text-xs font-black text-green-900 mb-1 uppercase tracking-widest">Alternativa Recomendada</p>
                     <p className="text-sm text-green-800 mb-3 font-medium leading-snug">Nuestros expertos sugieren <span className="font-bold">{upgradeCandidate.upgradeProduct.brand}</span> por su superioridad nutricional y vitalidad.</p>
                     <Link href={`/catalogo/${upgradeCandidate.upgradeProduct.slug}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95">
                        Ver alternativa saludable <ArrowRight className="w-3 h-3 ml-2" />
                     </Link>
                   </div>
                 </div>
              </div>
            )}

            {/* PRECIO Y TRANSPARENCIA */}
            <div>
              <div className="text-5xl font-black text-primary tracking-tighter flex items-baseline gap-4">
                ${product.sellingPrice.toLocaleString('es-CL')}
                {product.currentStock > 0 ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-200 block sm:inline-block relative -top-3">
                     En Stock
                  </span>
                ) : (
                   <span className="text-xs font-bold text-red-500 uppercase tracking-widest block sm:inline-block relative -top-3">Agotado</span>
                )}
              </div>
              {/* Mostrar Precio Por Kilo (Transparencia) */}
              {ppkg && (
                <p className="text-sm font-bold text-muted-foreground mt-2">
                  <span className="opacity-60 font-black uppercase text-[10px] tracking-widest mr-2">Referencia:</span> ${ppkg.toLocaleString('es-CL')} / kg
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { icon: <Scale className="w-4 h-4" />, label: "Peso", val: `${product.weight_kg}kg` },
                 { icon: <Dog className="w-4 h-4" />, label: "Etapa", val: product.life_stage },
                 { icon: <Briefcase className="w-4 h-4" />, label: "Formato", val: "Unidad" }, 
                 { icon: <Dog className="w-4 h-4" />, label: "Especie", val: product.species }
               ].map((attr, i) => (
                 <div key={i} className="bg-muted/30 p-3 rounded-2xl space-y-1 border border-black/[0.02]">
                   <div className="flex items-center gap-2 text-primary">
                      {attr.icon}
                      <span className="text-[10px] font-bold uppercase tracking-widest">{attr.label}</span>
                   </div>
                   <p className="font-bold text-sm truncate">{attr.val}</p>
                 </div>
               ))}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.short_description}
            </p>

            <div className="space-y-4 pt-4 border-t border-border/50">
              {/* COMPONENTE CLIENTE: Botón de agregar al carrito y selector de cantidad */}
              <ProductClientControls product={product} />

              {/* CROSS-SELL REACTIVO (Si no hay upgrade, ofrecemos el complemento ideal basado en el carrito real) */}
              {!upgradeCandidate && (
                <PredictiveCrossSell baseProduct={product} />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Relacionados asíncronos (Mismo animal, Misma Etapa) */}
      <RelatedProductsSlider 
        products={similarProducts} 
        title="Productos Similares"
        subtitle="Alternativas técnicas seleccionadas por expertos para tu mascota."
        viewAllHref={`/catalogo?especie=${encodeURIComponent(product.species)}`}
      />
    </div>
  );
}
