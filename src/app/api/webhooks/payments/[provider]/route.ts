import { NextRequest, NextResponse } from 'next/server';
import { PaymentFactory } from '@/lib/services/payments/payment.factory';

export async function POST(request: NextRequest, { params }: { params: { provider: string } }) {
  const providerName = params.provider; 

  try {
    // 1. Instanciar el proveedor correcto (Ej: 'khipu', 'webpay')
    const paymentProvider = PaymentFactory.getProvider(providerName);

    // 2. Procesar validación criptográfica y estado
    const { isValid, orderId, isPaid, paymentMethod } = await paymentProvider.processWebhook(request);

    if (!isValid || !orderId) {
      return NextResponse.json({ error: 'Firma inválida o datos faltantes' }, { status: 400 });
    }

    // 3. Avisar al ERP si el pago fue exitoso
    if (isPaid) {
      const erpApiUrl = process.env.ERP_API_URL || "http://localhost:3000";
      const erpSecret = process.env.ECOMMERCE_API_SECRET;

      const confirmResponse = await fetch(`${erpApiUrl}/api/webhooks/order-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${erpSecret}`
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentMethod: paymentMethod || 'TRANSFER',
          documentType: 'BOLETA' // TODO: El ERP puede leer la intención desde el DRAFT o podemos enviar esto dinámicamente.
        })
      });

      if (!confirmResponse.ok) {
        console.error(`[Webhook] El ERP falló al confirmar la orden ${orderId}`);
        return NextResponse.json({ error: 'Fallo al sincronizar con ERP' }, { status: 502 });
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook procesado y sincronizado' });

  } catch (error: any) {
    console.error(`[Webhook ${providerName}] Error:`, error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}