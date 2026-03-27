"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SanitizedProduct } from '@/types/product';
import { fetchAllProducts } from '@/actions/products';
import { getStrategicPriority } from '@/lib/services/market-intelligence.service';

const SEARCH_PLACEHOLDERS = [
  "¿Buscas alimento hipoalergénico? 🐕",
  "¿Arena aglutinante sin olor? ✨",
  "¿Snacks para premiar a tu cachorro? 🦴",
  "¿Comida para gatos mañosos? 🐈",
  "¿Buscas una marca en específico? 🔎",
];

/**
 * @fileOverview Hook que encapsula toda la inteligencia del motor de búsqueda.
 * Implementa prioridad estratégica en los resultados.
 */
export function useSmartSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState<SanitizedProduct[]>([]);
  
  // Estados para el efecto de escritura del placeholder
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carga inicial de productos
  useEffect(() => {
    fetchAllProducts().then(products => {
      setAllProducts(products.filter(p => p.currentStock > 0));
    });
  }, []);

  // Lógica del placeholder dinámico
  useEffect(() => {
    const fullText = SEARCH_PLACEHOLDERS[placeholderIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholder(fullText.substring(0, placeholder.length + 1));
        if (placeholder === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setPlaceholder(fullText.substring(0, placeholder.length - 1));
        if (placeholder === "") {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, placeholderIndex]);

  // Resultados filtrados con PRIORIDAD ESTRATÉGICA
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query.length < 2) return [];
    
    return allProducts
      .filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      )
      .map(p => {
        // Inyectamos prioridad estratégica para el ordenamiento del buscador
        const priority = getStrategicPriority(p.brand);
        let boost = priority.score;
        
        // Boost extra para términos genéricos si la marca es de alta confianza
        if ((query === 'alimento' || query === 'perro' || query === 'gato') && priority.isHighTrust) {
          boost += 5;
        }
        
        return { ...p, searchBoost: boost };
      })
      .sort((a, b) => (b as any).searchBoost - (a as any).searchBoost)
      .slice(0, 6);
  }, [searchTerm, allProducts]);

  // EFECTO CRÍTICO: Mostrar resultados automáticamente al escribir
  useEffect(() => {
    if (searchTerm.trim().length >= 2 && searchResults.length > 0) {
      setShowResults(true);
    } else if (searchTerm.trim().length < 2) {
      setShowResults(false);
    }
  }, [searchTerm, searchResults.length]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    showResults,
    setShowResults,
    searchResults,
    placeholder,
    handleSearchSubmit,
    clearSearch
  };
}
