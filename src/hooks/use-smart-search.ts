"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SanitizedProduct } from '@/types/product';
import { fetchAllProducts } from '@/actions/products';

const SEARCH_PLACEHOLDERS = [
  "¿Buscas 'el juguete indestructible'? 🦴",
  "¿Catnip para un viernes? 🌿",
  "¿Comida para perros mañosos? 🐕",
  "¿El mejor rascador del mundo? 🐈",
  "¿Arena que no huela a arena? ✨",
];

/**
 * @fileOverview Hook que encapsula toda la inteligencia del motor de búsqueda.
 * Gestiona el estado de escritura, el filtrado y la navegación.
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

  // Resultados filtrados (Memoizados para rendimiento)
  const searchResults = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];
    const query = searchTerm.toLowerCase();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchTerm, allProducts]);

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
