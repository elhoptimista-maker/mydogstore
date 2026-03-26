/**
 * @fileOverview Selector de Medios de Pago agnóstico para el Checkout.
 * Khipu (Transferencia) es un componente inyectado.
 */
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PaymentSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
  cartType: 'retail' | 'wholesale';
}

export default function PaymentSelector({ selectedMethod, onSelect, cartType }: PaymentSelectorProps) {
  const paymentMethods = [
    {
      id: 'mock',
      title: '🧪 MODO PRUEBAS (Sandbox)',
      description: 'Simula un pago sin usar dinero real. Solo visible en desarrollo.',
      icon: <CreditCard className="w-5 h-5" />,
      allowedFor: ['retail', 'wholesale'],
      logo: null
    },
    {
      id: 'khipu',
      title: 'Transferencia Bancaria',
      description: 'Paga de forma segura desde tu banco (vía Khipu).',
      icon: <Banknote className="w-5 h-5" />,
      allowedFor: ['retail', 'wholesale'],
      logo: 'https://s3.amazonaws.com/static.khipu.com/2021/logo-transparent.png' // Logo oficial Khipu
    },
    {
      id: 'credit_card',
      title: 'Tarjeta de Crédito / Débito',
      description: 'Paga con Webpay, Visa, Mastercard, etc.',
      icon: <CreditCard className="w-5 h-5" />,
      allowedFor: ['retail'],
      logo: null
    },
    {
      id: 'credit_line',
      title: 'Línea de Crédito 30 Días',
      description: 'Exclusivo para distribuidores MyDog registrados.',
      icon: <Building2 className="w-5 h-5" />,
      allowedFor: ['wholesale'],
      logo: null
    }
  ];

  const availableMethods = paymentMethods.filter(m => m.allowedFor.includes(cartType));

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black uppercase tracking-tighter mb-6">3. Método de Pago</h3>
      <div className="grid grid-cols-1 gap-4">
        {availableMethods.map((method) => (
          <Label
            key={method.id}
            htmlFor={method.id}
            className={cn(
              "flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all gap-4 group",
              selectedMethod === method.id 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-black/5 bg-white hover:border-primary/30"
            )}
            onClick={() => onSelect(method.id)}
          >
            <div className="flex items-center gap-5">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => onSelect(method.id)}
                  className="w-5 h-5 text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                />
              </div>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                selectedMethod === method.id ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                {method.icon}
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "font-black text-sm uppercase tracking-widest",
                  selectedMethod === method.id ? "text-primary" : "text-foreground"
                )}>
                  {method.title}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground mt-0.5 max-w-[200px] leading-tight">
                  {method.description}
                </span>
              </div>
            </div>

            {/* Logo del proveedor si existe */}
            {method.logo && (
              <div className="relative h-6 w-20 md:w-24 shrink-0 opacity-80 mix-blend-multiply md:ml-auto">
                 <Image src={method.logo} alt={method.title} fill className="object-contain object-left md:object-right" />
              </div>
            )}
          </Label>
        ))}
      </div>
      
      {/* Información específica del método Khipu cuando está seleccionado */}
      {selectedMethod === 'khipu' && (
        <Card className="mt-4 bg-blue-50/50 border-blue-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
           <CardContent className="p-6 flex items-start gap-4">
              <Banknote className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                 <p className="text-xs font-bold text-blue-900">Pago Seguro y Rápido</p>
                 <p className="text-[10px] font-medium text-blue-800/80 leading-relaxed">
                    Al confirmar tu compra, serás redirigido al portal seguro de Khipu para realizar tu transferencia. 
                    El pago se acredita inmediatamente en nuestro sistema.
                 </p>
              </div>
           </CardContent>
        </Card>
      )}
    </div>
  );
}
