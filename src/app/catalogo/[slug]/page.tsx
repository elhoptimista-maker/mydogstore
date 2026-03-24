import { fetchProductBySlug, fetchAllProducts } from '@/actions/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, ShieldCheck, Truck, RefreshCw, Scale, Dog, Briefcase, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductClientControls from '@/components/catalogo/ProductClientControls';
import ProductHeaderActions from '@/components/catalogo/ProductHeaderActions';
import RelatedProductsSlider from '@/components/catalogo/RelatedProductsSlider';
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
  const slug = params.slug;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Lógica Avanzada de Productos Similares basada en Atributos
  const allProducts = await fetchAllProducts();
  const similarProducts = allProducts
    .filter(p => p.id !== product.id && p.currentStock > 0)
    .map(p => {
      let score = 0;
      if (p.species === product.species) score += 10;
      if (p.category === product.category) score += 5;
      if (p.brand === product.brand) score += 3;
      if (p.life_stage === product.life_stage) score += 2;
      return { ...p, similarityScore: score };
    })
    .filter(p => p.similarityScore >= 10)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 15);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.main_image,
    description: product.short_description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: product.sellingPrice,
      availability: product.currentStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-1 pb-24 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
          {/* Galería de Imágenes */}
          <div className="space-y-6">
            <div className="aspect-square relative rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-black/5 border border-border/50 group">
              {product.currentStock <= 0 && (
                <div className="absolute top-8 left-8 z-10">
                  <Badge className="bg-destructive text-white border-none font-black text-xs uppercase tracking-widest px-4 py-2">Agotado</Badge>
                </div>
              )}
              <Image
                src={product.main_image}
                alt={product.name}
                fill
                className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Información Técnica y Venta */}
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
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 fill-current ${i > 4 ? 'text-gray-200' : ''}`} />
                  ))}
                  <span className="ml-2 font-bold text-foreground">4.8</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm font-medium text-muted-foreground tracking-tight">SKU: {product.sku}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-5xl font-black text-primary tracking-tighter flex items-baseline gap-4">
                ${product.sellingPrice.toLocaleString('es-CL')}
                {product.currentStock > 0 ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-200 block sm:inline-block relative -top-3">
                     En Stock
                  </span>
                ) : (
                   <span className="text-xs font-bold text-red-500 uppercase tracking-widest block sm:inline-block relative -top-3">Sin inventario</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { icon: <Scale className="w-4 h-4" />, label: "Peso", val: `${product.weight_kg}kg` },
                 { icon: <Dog className="w-4 h-4" />, label: "Etapa", val: product.life_stage },
                 { icon: <Briefcase className="w-4 h-4" />, label: "Formato", val: "Unidad" }, 
                 { icon: <Dog className="w-4 h-4" />, label: "Especie", val: product.species }
               ].map((attr, i) => (
                 <div key={i} className="bg-muted/30 p-3 rounded-2xl space-y-1">
                   <div className="flex items-center gap-2 text-primary">
                      {attr.icon}
                      <span className="text-[10px] font-bold uppercase tracking-widest">{attr.label}</span>
                   </div>
                   <p className="font-bold text-sm truncate" title={attr.val}>{attr.val}</p>
                 </div>
               ))}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.short_description}
            </p>

            <ProductClientControls product={product} />

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <Truck className="w-4 h-4" />, text: "Despacho Express" },
                { icon: <ShieldCheck className="h-4 w-4" />, text: "Pago Seguro" },
                { icon: <RefreshCw className="h-4 w-4" />, text: "Garantía MyDog" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider leading-none text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedProductsSlider 
        products={similarProducts} 
        title="Productos Similares"
        subtitle="Alternativas técnicas seleccionadas por expertos para tu mascota."
        viewAllHref={`/catalogo?especie=${encodeURIComponent(product.species)}`}
      />
    </div>
  );
}
