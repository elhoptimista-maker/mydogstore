import { getSanitizedProducts } from '@/lib/services/catalog.service';
import PetNavigation from '@/components/home/PetNavigation';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import SocialProof from '@/components/home/SocialProof';
import TrustBar from '@/components/home/TrustBar';

/**
 * @fileOverview Página principal (Home) refactorizada con componentes aislados.
 */

export default async function Home() {
  // Consumo del servicio de catálogo sanitizado
  const products = await getSanitizedProducts();
  
  // Seleccionamos los destacados para la home: con stock y mayor cantidad disponible
  const featuredProducts = products
    .filter(p => p.currentStock > 0)
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 10);

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Navegación por Mascota */}
      <PetNavigation products={products} />

      {/* Grilla de Productos Destacados */}
      <FeaturedProducts products={featuredProducts} />

      {/* Prueba Social */}
      <SocialProof />

      {/* Barra de Confianza */}
      <TrustBar />
    </div>
  );
}
