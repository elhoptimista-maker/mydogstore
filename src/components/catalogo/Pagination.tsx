"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  totalPages: number;
}

/**
 * @fileOverview Componente de paginación con lógica de ventana deslizante (Sliding Window).
 * Maneja la navegación de forma reactiva a la URL y optimiza la visualización de páginas.
 */
export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Generador de URLs seguro (clona los parámetros actuales y solo cambia la página)
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Lógica de la Ventana Deslizante
  const generatePagination = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Caso 1: Cerca del principio
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    }

    // Caso 2: Cerca del final
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // Caso 3: En el medio
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const allPages = generatePagination();

  // Si solo hay una página, no renderizamos el paginador
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 pt-12">
      {/* Botón Anterior */}
      <Button 
        variant="ghost" 
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
        className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-black/5 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
      >
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)} aria-label="Página anterior">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </Button>

      {/* Números de Página */}
      <div className="flex items-center gap-2">
        {allPages.map((page, index) => {
          if (page === '...') {
            return (
              <div key={`ellipsis-${index}`} className="w-10 flex justify-center text-muted-foreground/50">
                <MoreHorizontal className="w-5 h-5" />
              </div>
            );
          }

          const isCurrentPage = currentPage === page;

          return (
            <Button 
              key={`page-${page}`}
              asChild={!isCurrentPage}
              className={cn(
                "w-12 h-12 rounded-full font-black transition-all",
                isCurrentPage 
                  ? "bg-secondary text-primary shadow-xl shadow-secondary/20 scale-110 pointer-events-none" 
                  : "bg-white text-foreground shadow-sm border border-black/5 hover:bg-primary/5 hover:text-primary"
              )}
            >
              {!isCurrentPage ? (
                <Link href={createPageURL(page as number)}>
                  {(page as number).toString().padStart(2, '0')}
                </Link>
              ) : (
                <span>{(page as number).toString().padStart(2, '0')}</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Botón Siguiente */}
      <Button 
        variant="ghost" 
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
        className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-black/5 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)} aria-label="Página siguiente">
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
