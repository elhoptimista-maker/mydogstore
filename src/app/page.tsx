import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, ShieldCheck, Truck, Dog } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductAssistant from '@/components/ProductAssistant';
import { getProducts } from '@/lib/mock-db';

export default async function Home() {
  const featuredProducts = await getProducts();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/doghero/1920/1080"
            alt="Happy dog banner"
            fill
            className="object-cover brightness-75 md:brightness-90"
            priority
            data-ai-hint="happy dog"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:from-black/20" />
        </div>
        
        <div className="relative z-10 max-w-2xl text-white space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-xs font-bold uppercase tracking-widest">
            <Star className="w-3 h-3 text-accent fill-current" />
            Voted #1 Premium Dog Care
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold leading-[1.1] tracking-tight">
            Only the <span className="text-accent">best</span> for your best friend.
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-lg">
            Curated premium nutrition, orthopedic comfort, and intelligent toys tailored for your dog's unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/products">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-accent hover:bg-accent/90 text-primary-foreground font-bold text-lg shadow-xl shadow-accent/20">
                Shop Collection
              </Button>
            </Link>
            <Link href="#advisor">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 font-bold text-lg">
                Dog Advisor AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl space-y-2 border border-border/50">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h3 className="font-bold text-sm">Certified Safe</h3>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl space-y-2 border border-border/50">
          <Truck className="w-8 h-8 text-primary" />
          <h3 className="font-bold text-sm">Fast Delivery</h3>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl space-y-2 border border-border/50">
          <Star className="w-8 h-8 text-primary" />
          <h3 className="font-bold text-sm">Premium Quality</h3>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl space-y-2 border border-border/50">
          <Dog className="w-8 h-8 text-primary" />
          <h3 className="font-bold text-sm">Dog Approved</h3>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold text-primary">Best Sellers</h2>
            <p className="text-muted-foreground">The most loved items by our furry community.</p>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            See All Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="md:hidden pt-4">
          <Link href="/products">
            <Button variant="outline" className="w-full h-12 rounded-xl border-primary text-primary">
              View Entire Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* AI Assistant Section */}
      <div id="advisor" className="bg-secondary/20 py-20">
        <ProductAssistant />
      </div>

      {/* Instagram/Community Style Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8 text-center">
        <h2 className="text-3xl font-headline font-bold text-primary">Join our Happy Pack</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="aspect-square relative rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
              <Image 
                src={`https://picsum.photos/seed/happy-dog-${i}/400/400`} 
                alt="Happy customer" 
                fill 
                className="object-cover"
                data-ai-hint="happy dog"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
