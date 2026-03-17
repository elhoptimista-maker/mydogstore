
import { getProductById } from '@/lib/mock-db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart, ShieldCheck, Heart, Share2, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | MydogStore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": [product.imageUrl],
            "description": product.description,
            "sku": product.id,
            "brand": {
              "@type": "Brand",
              "name": "MydogStore"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": product.price,
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": "124"
            }
          })
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Gallery Placeholder */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-3xl overflow-hidden bg-white shadow-sm group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              data-ai-hint="dog product"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square relative rounded-xl overflow-hidden border-2 border-transparent hover:border-primary/50 cursor-pointer">
                <Image 
                  src={`https://picsum.photos/seed/product-${i}/200/200`} 
                  alt="detail" 
                  fill 
                  className="object-cover"
                  data-ai-hint="dog detail"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="px-3 py-1 bg-accent/10 text-accent border-none text-xs font-bold uppercase tracking-wider">
                {product.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary tracking-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 fill-current ${i > Math.floor(product.rating) ? 'text-gray-200' : ''}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">(124 Customer Reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 h-14 rounded-2xl bg-primary text-lg font-bold gap-3 shadow-xl shadow-primary/20">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
              <Button variant="outline" className="flex-1 h-14 rounded-2xl border-primary text-primary hover:bg-primary/5 text-lg font-bold">
                Subscribe & Save 10%
              </Button>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              Free Worldwide Delivery
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-accent" />
              </div>
              30-Day Happiness Guarantee
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              Vet Certified Ingredients
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
