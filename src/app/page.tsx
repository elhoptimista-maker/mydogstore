import { getSanitizedProducts } from '@/lib/services/catalog.service';
import Hero from '@/components/home/Hero';
import PetNavigation from '@/components/home/PetNavigation';
import PromotionalBanners from '@/components/home/PromotionalBanners';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FlashDeal from '@/components/home/FlashDeal';
import SocialProof from '@/components/home/SocialProof';
import TrustBar from '@/components/home/TrustBar';
import BlogSection from '@/components/home/BlogSection';
import InstagramGallery from '@/components/home/InstagramGallery';

/**
 * @fileOverview Página principal (Home) orquestada por el Arquitecto de Frontend.
 * Implementa un flujo de conversión de alto rendimiento con secciones adaptativas.
 * Los productos destacados ahora siguen la Lógica de Pivote Estratégico (Smart Score).
 */

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getSanitizedProducts();
  
  // SELECCIÓN ESTRATÉGICA PARA LA VITRINA PRINCIPAL:
  // 1. Solo productos con stock físico real.
  // 2. Respetamos el orden del CatalogService, que ya viene ponderado por Smart Score.
  // Esto asegura que marcas como Purina One, Nomade o Churu aparezcan primero por su 
  // alto sentimiento y tracción en el mercado chileno.
  const featuredProducts = products
    .filter(p => p.currentStock > 0)
    .slice(0, 10);

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      {/* 1. Impacto Inicial: Hero con mascota principal */}
      <Hero />

      {/* 2. Navegación Inteligente: Guías expertos por especie */}
      <PetNavigation products={products} />

      {/* 3. Oportunidades: Banners de colección y novedades */}
      <PromotionalBanners />

      {/* 4. Vitrina Estratégica: Top 10 de productos según Smart Score */}
      <FeaturedProducts products={featuredProducts} />

      {/* 5. Urgencia: Oferta relámpago con cuenta regresiva */}
      <FlashDeal />

      {/* 6. Autoridad: Testimonios y prueba social */}
      <SocialProof />

      {/* 7. Conocimiento: Noticias y consejos de expertos */}
      <BlogSection />

      {/* 8. Logística: Barra de beneficios y garantías */}
      <TrustBar />

      {/* 9. Comunidad: Galería social de Instagram */}
      <InstagramGallery />
    </div>
  );
}
