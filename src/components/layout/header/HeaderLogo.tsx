"use client";

import BrandLogo from '../BrandLogo';

interface HeaderLogoProps {
  className?: string;
}

/**
 * @fileOverview Alias para el BrandLogo usado en el Header.
 */
export default function HeaderLogo({ className }: HeaderLogoProps) {
  return <BrandLogo className={className} variant="light" />;
}
