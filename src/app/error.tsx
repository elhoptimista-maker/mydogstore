"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dog, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí podrías loguear el error a un servicio externo (Sentry, etc.)
    console.warn('UI Error Boundary caught:', error.message);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-6">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
        <Dog className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">¡Ups! Algo no salió bien</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Parece que nuestro peludo se distrajo. No te preocupes, estamos trabajando en ello.
        </p>
      </div>
      <Button 
        onClick={() => reset()}
        className="h-12 px-8 rounded-xl bg-primary gap-2 font-bold"
      >
        <RefreshCcw className="w-4 h-4" /> Intentar de nuevo
      </Button>
    </div>
  );
}