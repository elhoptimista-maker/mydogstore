import { getSanitizedProducts } from '@/lib/services/catalog.service';
import Hero from '@/components/home/Hero';
import PetNavigation from '@/components/home/PetNavigation';
import PromotionalBanners from '@/components/home/PromotionalBanners';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FlashDeal from '@/components/home/FlashDeal';
import SocialProof from '@/components/home/SocialProof';
import TrustBar from '@/components/home/TrustBar';

/**
 * @fileOverview Página principal (Home) compuesta íntegramente por componentes modulares.
 * Se han ocultado temporalmente las secciones de Blog e Instagram.
 */

export default async function Home() {
  const products = await getSanitizedProducts();
  
  const featuredProducts = products
    .filter(p => p.currentStock > 0)
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 10);

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      {/* 1. Hero Impresión Inicial */}
      <Hero />

      {/* 2. Navegación por Mascota (Burbujas) */}
      <PetNavigation products={products} />

      {/* 3. Banners Promocionales (Super-Cards) */}
      <PromotionalBanners />

      {/* 4. Productos Destacados */}
      <FeaturedProducts products={featuredProducts} />

      {/* 5. Oferta Relámpago */}
      <FlashDeal />

      {/* 6. Prueba Social (Testimonios) */}
      <SocialProof />

      {/* 7. Barra de Confianza */}
      <TrustBar />
      
      {/* 
          Secciones ocultas temporalmente:
          <BlogSection />
          <InstagramGallery />
      */}
    </div>
  );
}
