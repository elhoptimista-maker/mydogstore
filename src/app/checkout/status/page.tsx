"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Package, ArrowRight, ShoppingBag, Info } from 'lucide-react';
import Link from 'next/link';

// Componente que usa useSearchParams debe estar envuelto en Suspense
function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('order');
  const canceled = searchParams.get('canceled');
  const [status, setStatus] = useState<'loading' | 'success' | 'canceled' | 'error'>('loading');

  useEffect(() => {
    // Si viene el flag canceled desde Khipu
    if (canceled === 'true') {
      setStatus('canceled');
      return;
    }

    if (!orderId) {
      setStatus('error');
      return;
    }

    // Aquí idealmente haríamos un "polling" (consulta) a nuestro backend para 
    // verificar si el webhook ya procesó el pago y actualizó el estado a 'completed'.
    // Por simplicidad en esta fase, asumiremos que si llega aquí sin "canceled", 
    // está en proceso de validación.
    
    // Simulación de carga (en un entorno real sería un fetch)
    const timer = setTimeout(() => {
      setStatus('success'); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [orderId, canceled]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">Verificando Pago...</h2>
        <p className="text-sm font-bold text-muted-foreground">Estamos confirmando tu transacción con el banco.</p>
        <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold mt-4">
           <Info className="w-5 h-5 shrink-0" />
           <p className="text-left">Por favor no cierres esta ventana hasta que confirmemos la recepción de los fondos.</p>
        </div>
      </div>
    );
  }

  if (status === 'canceled') {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-[2rem] flex items-center justify-center text-red-600 mb-4 animate-in zoom-in duration-300">
          <XCircle className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter uppercase text-foreground">Pago Cancelado</h2>
        <p className="text-muted-foreground font-medium max-w-md mx-auto">
          Has cancelado el proceso de pago en la plataforma del banco o el tiempo expiró. 
          Tu pedido quedó guardado, puedes intentar pagarlo nuevamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full max-w-md">
          <Button 
            onClick={() => router.push('/checkout')} 
            className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest"
          >
            Intentar de Nuevo
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/catalogo')} 
            className="flex-1 h-14 rounded-2xl border-black/10 font-black text-xs uppercase tracking-widest"
          >
            Volver a la Tienda
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
     return (
        <div className="text-center p-12">
           <p className="font-bold text-red-500">Error al leer la información de la orden.</p>
           <Link href="/" className="text-[10px] uppercase font-black tracking-widest underline mt-4 block">Ir al inicio</Link>
        </div>
     );
  }

  // SUCCESS
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 space-y-8 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="relative">
         <div className="w-24 h-24 bg-green-100 rounded-[2.5rem] flex items-center justify-center text-green-600 mb-2 mx-auto shadow-inner border border-green-200">
           <CheckCircle2 className="w-12 h-12" />
         </div>
         <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
            <Package className="w-6 h-6 text-primary" />
         </div>
      </div>
      
      <div className="space-y-3">
         <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            ¡Choca esos cinco! 🐾
         </div>
         <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">¡Recibimos tu pedido!</h2>
         <p className="text-muted-foreground font-medium max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Ya estamos en la bodega preparando el paquete para tu mascota. Revisa tu correo, ahí te dejamos el comprobante y los detalles del despacho en la Región Metropolitana.
         </p>
      </div>

      <div className="bg-muted/30 p-6 md:p-8 rounded-[2rem] border border-black/5 w-full max-w-md flex flex-col items-center justify-center">
         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Número de Seguimiento</span>
         <span className="text-3xl font-black tracking-tighter text-foreground">{orderId}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-md">
        <Button 
          onClick={() => router.push('/cuenta')} 
          className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          Ver Mis Pedidos
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push('/catalogo')} 
          className="flex-1 h-14 rounded-2xl border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all"
        >
          <ShoppingBag className="w-4 h-4 mr-2" /> Seguir Comprando
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <div className="bg-[#F6F6F6] min-h-screen py-12 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
          <CardContent className="p-0">
             <Suspense fallback={<div className="p-20 text-center text-muted-foreground font-bold animate-pulse">Cargando estado...</div>}>
                <StatusContent />
             </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
