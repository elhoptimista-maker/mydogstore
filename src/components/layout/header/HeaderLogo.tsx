"use client";

import BrandLogo from '../BrandLogo';

interface HeaderLogoProps {
  className?: string;
}

/**
 * @fileOverview Alias para el BrandLogo usado en el Header.
 * Forzado a escala LG para coincidir con la versión oficial de la marca.
 */
export default function HeaderLogo({ className }: HeaderLogoProps) {
  return <BrandLogo className={className} variant="light" size="lg" />;
}
