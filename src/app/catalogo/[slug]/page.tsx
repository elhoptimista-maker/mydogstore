
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

  const brandKey = product.brand?.toLowerCase().trim() || '';
  const metrics = MARKET_INTELLIGENCE[brandKey];
  const dynamicRating = metrics ? (metrics.sentiment / 2).toFixed(1) : "4.5";
  const ppkg = product.weight_kg && product.weight_kg > 0 
    ? Math.round(product.sellingPrice / product.weight_kg) 
    : null;

  const mockCartContext = [{ 
    ...product, 
    priceAtAddition: product.sellingPrice, 
    quantity: 1,
    cartType: 'retail' as const 
  }];
  
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-24 space-y-12 md:space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="space-y-6">
        {/* Breadcrumbs - Scrollable on mobile */}
        <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground overflow-x-auto no-scrollbar whitespace-nowrap pb-2 md:pb-0">
           <Link href="/catalogo" className="hover:text-primary transition-colors shrink-0">Catálogo</Link>
           <ChevronRight className="w-3 h-3 mx-2 opacity-50 shrink-0" />
           <Link href={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors shrink-0">{product.category}</Link>
           <ChevronRight className="w-3 h-3 mx-2 opacity-50 shrink-0" />
           <span className="text-foreground truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Imagen (Sticky on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-48">
            <div className="aspect-square relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-white shadow-2xl shadow-black/5 border border-black/[0.03] group flex items-center justify-center transition-all duration-500 hover:shadow-black/10">
              {product.currentStock <= 0 && (
                <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
                  <Badge className="bg-zinc-900 text-white border-none font-black text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl">Agotado</Badge>
                </div>
              )}
              {metrics && metrics.quality >= 4 && (
                 <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10 bg-green-50/90 backdrop-blur-md text-green-700 border border-green-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Nutrición Premium</span>
                 </div>
              )}
              <div className="relative w-full h-full p-8 md:p-16 transition-transform duration-700 group-hover:scale-105">
                <Image src={product.main_image} alt={product.name} fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Información y Conversión */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-8 md:gap-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <Badge className="px-4 py-1.5 bg-primary text-white border-none text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-primary/10">
                  {product.brand} | {product.category}
                </Badge>
                <ProductHeaderActions product={product} />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tighter">
                  {product.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-1.5 text-secondary">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 fill-current ${i > Math.round(Number(dynamicRating)) ? 'text-gray-200' : ''}`} />
                    ))}
                    <span className="ml-1.5 font-black text-sm text-foreground tracking-tight">{dynamicRating} <span className="text-muted-foreground font-medium text-xs">/ 5.0</span></span>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">SKU: {product.sku}</span>
                </div>
              </div>
            </div>

            {/* UPSELL INMEDIATO */}
            {upgradeCandidate && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-5 rounded-[2rem] animate-in fade-in slide-in-from-top-4 shadow-sm border-l-4 border-l-green-500">
                 <div className="flex items-start gap-4">
                   <div className="bg-green-600 rounded-full p-1.5 shrink-0 shadow-lg shadow-green-600/20">
                    <ShieldCheck className="w-4 h-4 text-white" />
                   </div>
                   <div className="space-y-3">
                     <div>
                       <p className="text-[10px] font-black text-green-900 mb-1 uppercase tracking-widest">Alternativa Recomendada MyDog</p>
                       <p className="text-sm text-green-800 font-medium leading-relaxed">¿Sabías que <span className="font-bold">{upgradeCandidate.upgradeProduct.brand}</span> ofrece una nutrición superior para su etapa <span className="lowercase">{product.life_stage}</span>?</p>
                     </div>
                     <Link href={`/catalogo/${upgradeCandidate.upgradeProduct.slug}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 group">
                        Ver propuesta saludable <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Link>
                   </div>
                 </div>
              </div>
            )}

            {/* PRECIO Y TRANSPARENCIA */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                <div className="text-5xl md:text-6xl font-black text-primary tracking-tighter">
                  ${product.sellingPrice.toLocaleString('es-CL')}
                </div>
                <div className="flex items-center gap-2">
                  {product.currentStock > 0 ? (
                    <Badge variant="outline" className="text-[9px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border-green-200">
                       ✓ En Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Agotado</Badge>
                  )}
                </div>
              </div>
              {ppkg && (
                <p className="text-xs md:text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <span className="opacity-40 font-black uppercase text-[9px] tracking-[0.2em]">Referencia:</span> 
                  <span className="bg-muted px-2 py-0.5 rounded-lg">${ppkg.toLocaleString('es-CL')} / kg</span>
                </p>
              )}
            </div>

            {/* ATRIBUTOS CLAVE - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
               {[
                 { icon: <Scale className="w-4 h-4" />, label: "Peso", val: `${product.weight_kg}kg` },
                 { icon: <Dog className="w-4 h-4" />, label: "Etapa", val: product.life_stage },
                 { icon: <Briefcase className="w-4 h-4" />, label: "Formato", val: "Unidad" }, 
                 { icon: <Dog className="w-4 h-4" />, label: "Especie", val: product.species }
               ].map((attr, i) => (
                 <div key={i} className="bg-white p-4 rounded-2xl space-y-2 border border-black/[0.03] shadow-sm hover:border-primary/20 transition-colors">
                   <div className="flex items-center gap-2 text-primary opacity-60">
                      {attr.icon}
                      <span className="text-[9px] font-black uppercase tracking-widest">{attr.label}</span>
                   </div>
                   <p className="font-bold text-xs md:text-sm truncate">{attr.val}</p>
                 </div>
               ))}
            </div>

            <div className="space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">
                {product.short_description}
              </p>

              <div className="space-y-6 pt-6 border-t border-black/[0.05]">
                {/* COMPONENTE CLIENTE: Botón de agregar al carrito y selector de cantidad */}
                <ProductClientControls product={product} />

                {/* CROSS-SELL REACTIVO */}
                {!upgradeCandidate && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 delay-300">
                    <PredictiveCrossSell baseProduct={product} />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Relacionados - Refined for Mobile spacing */}
      <div className="pt-10 border-t border-black/[0.03]">
        <RelatedProductsSlider 
          products={similarProducts} 
          title="Productos Similares"
          subtitle="Alternativas técnicas seleccionadas por expertos para tu mascota."
          viewAllHref={`/catalogo?especie=${encodeURIComponent(product.species)}`}
        />
      </div>
    </div>
  );
}
