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
 * + un Filtro de Diversidad Estricto para maximizar la percepción de variedad.
 */

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getSanitizedProducts();
  
  // ------------------------------------------------------------------
  // ALGORITMO DE VITRINA BALANCEADA (Diversity Filter)
  // ------------------------------------------------------------------
  // Evita la redundancia visual. Recorremos los productos ordenados por 
  // Smart Score, pero aplicamos reglas de curaduría para mostrar variedad.
  
  const featuredProducts = [];
  const categoryCount: Record<string, number> = {};
  const brandCount: Record<string, number> = {};

  for (const p of products) {
    if (p.currentStock <= 0) continue;

    const cat = p.category || "Varios";
    const brand = p.brand || "Genérico";

    if (!categoryCount[cat]) categoryCount[cat] = 0;
    if (!brandCount[brand]) brandCount[brand] = 0;

    // REGLA DE NEGOCIO ESTRICTA PARA MÁXIMA VARIEDAD: 
    // - Máximo 1 producto de la misma marca (Evita el "Muro de marca")
    // - Máximo 2 productos de la misma categoría (Equilibrio entre Alimento, Snacks, etc.)
    if (brandCount[brand] < 1 && categoryCount[cat] < 2) {
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

      {/* 4. Vitrina Estratégica: Top 10 Ultra-Balanceado */}
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
