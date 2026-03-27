"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * @fileOverview Pantalla de simulación de portal bancario.
 * Oculta el header y footer global para simular una redirección externa.
 */
function MockPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const notifyUrl = searchParams.get('notifyUrl');

  const simulatePayment = async (isSuccess: boolean) => {
    setLoading(true);
    try {
      // 1. Simulamos que el banco le avisa a nuestro servidor (Dispara el Webhook)
      if (notifyUrl) {
        await fetch(notifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secretToken: 'test-secret-123',
            orderId: orderId,
            status: isSuccess ? 'PAID' : 'FAILED'
          })
        });
      }

      // 2. Redirigimos al usuario a la pantalla de éxito o fracaso
      setTimeout(() => {
        if (isSuccess) {
          router.push(`/checkout/status?order=${orderId}`);
        } else {
          router.push(`/checkout/status?order=${orderId}&canceled=true`);
        }
      }, 1500);

    } catch (error) {
      console.error("Error simulando webhook", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      {/* 
        Inyectamos estilos para limpiar la UI de elementos del ecommerce 
        y dar sensación de portal bancario independiente.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        #global-header { display: none !important; }
        #global-main { padding-top: 0 !important; }
        footer { display: none !important; }
      `}} />

      <div className="bg-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center space-y-6 border border-slate-700 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-2xl mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest text-white">Banco de Pruebas</h1>
        <p className="text-sm text-slate-400">Estás en un entorno de simulación (Sandbox). Ningún cobro real será efectuado.</p>
        
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total a Pagar</p>
          <p className="text-3xl font-black text-white">${Number(amount).toLocaleString('es-CL')}</p>
          <p className="text-xs text-slate-500 mt-2">Orden ID: {orderId}</p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={() => simulatePayment(true)} 
            disabled={loading}
            className="h-14 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest shadow-lg shadow-green-900/20 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simular Pago Exitoso'}
          </Button>
          <Button 
            onClick={() => simulatePayment(false)} 
            disabled={loading}
            variant="outline"
            className="h-14 border-red-500/30 text-red-400 hover:bg-red-500/10 font-black uppercase tracking-widest"
          >
            Simular Pago Rechazado
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}>
      <MockPaymentContent />
    </Suspense>
  );
}