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
 * Los productos destacados ahora siguen la Lógica de Pivote Estratégico (Smart Score)
 * + un Filtro de Diversidad para evitar saturación de una sola marca.
 */

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getSanitizedProducts();
  
  // ------------------------------------------------------------------
  // ALGORITMO DE VITRINA BALANCEADA (Diversity Filter)
  // ------------------------------------------------------------------
  // Evita el "Muro de Churu". Recorremos los productos que ya vienen 
  // ordenados por mayor Smart Score, pero forzamos variedad.
  
  const featuredProducts = [];
  const categoryCount: Record<string, number> = {};
  const brandCount: Record<string, number> = {};

  for (const p of products) {
    if (p.currentStock <= 0) continue;

    const cat = p.category || "Varios";
    const brand = p.brand || "Genérico";

    if (!categoryCount[cat]) categoryCount[cat] = 0;
    if (!brandCount[brand]) brandCount[brand] = 0;

    // REGLA DE NEGOCIO: 
    // Máximo 2 productos de la misma marca (Ej: Max 2 Churus)
    // Máximo 3 productos de la misma categoría (Ej: Max 3 Snacks en total)
    if (brandCount[brand] < 2 && categoryCount[cat] < 3) {
      featuredProducts.push(p);
      categoryCount[cat]++;
      brandCount[brand]++;
    }

    // Llenamos solo los 10 espacios de la vitrina principal
    if (featuredProducts.length >= 10) break;
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      {/* 1. Impacto Inicial: Hero con mascota principal */}
      <Hero />

      {/* 2. Navegación Inteligente: Guías expertos por especie */}
      <PetNavigation products={products} />

      {/* 3. Oportunidades: Banners de colección y novedades */}
      <PromotionalBanners />

      {/* 4. Vitrina Estratégica: Top 10 Balanceado */}
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
