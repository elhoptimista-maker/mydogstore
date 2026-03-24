/**
 * @fileOverview Webhook para notificaciones de pago desde Khipu.
 * Endpoint crítico que recibe llamadas asíncronas de la pasarela para confirmar pagos.
 */

import { NextResponse } from 'next/server';
import { getErpDbAdmin } from '@/lib/firebase/erp-admin';
import { KhipuService } from '@/lib/services/payments/khipu.service';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/webhooks/khipu
 * Khipu llama a esta URL de forma silenciosa cuando un pago cambia de estado.
 */
export async function POST(req: Request) {
  try {
    // 1. Khipu envía la notificación como form-urlencoded por defecto en su webhook
    const formData = await req.formData();
    const apiVersion = formData.get('api_version');
    const notificationToken = formData.get('notification_token');

    // Validación básica de parámetros de entrada
    if (!notificationToken || apiVersion !== '3.0') {
      console.error('[Webhook Khipu] Notificación inválida o versión incorrecta:', { apiVersion, notificationToken });
      return NextResponse.json({ error: 'Invalid notification parameters' }, { status: 400 });
    }

    // 2. Validación de Seguridad (El paso más importante)
    // No confiamos ciegamente en el POST. Usamos el token para pedirle a Khipu
    // el estado real y firmado del pago usando nuestra API KEY privada.
    // *Nota: Khipu v3 usa el notification_token para consultar el estado del pago mediante un endpoint específico,
    // o en su defecto, si no se usa el endpoint de notificaciones, se consulta por el ID del pago.
    // Dado que el flujo estandar de webhooks v3 requiere un GET /payments usando el token/id de pago:
    
    // Por la especificación OpenAPI, el POST de webhook de Khipu suele traer el 'payment_id' o podemos
    // usar el propio KhipuService para consultar el ID que guardamos.
    // Asumiremos que nos envía 'payment_id' en el form (estándar). Si no, Khipu recomienda usar su endpoint /payments.
    // Reemplazaremos esto temporalmente por una búsqueda si Khipu envía el notification_token para consultar pagos.
    
    // Simplificación basada en OpenAPI: Consultamos el estado usando el KhipuService (que debe extenderse si Khipu
    // pide una validación específica por token de notificación en vez de payment_id directamente).
    
    // Si Khipu nos pasara un ID en el webhook o si lo resolvemos internamente:
    // Aquí implementamos una búsqueda inversa (asumiendo que guardamos el notification_token en la orden)
    // Pero Khipu v3 tiene un endpoint especial GET /v3/payments?notification_token=... (no documentado arriba pero común).
    
    // Para adaptarnos estrictamente a lo documentado (getPaymentById):
    // Necesitamos el payment_id.
    const paymentId = formData.get('payment_id')?.toString();
    
    if (!paymentId) {
       console.error('[Webhook Khipu] No se recibió payment_id en el webhook.');
       return NextResponse.json({ error: 'Missing payment_id' }, { status: 400 });
    }

    // Consultamos a Khipu la verdad absoluta sobre este pago
    const paymentData = await KhipuService.getPaymentStatus(paymentId);
    
    console.log(`[Webhook Khipu] Verificación de pago ${paymentId}: Estado = ${paymentData.status}`);

    if (paymentData.status !== 'done') {
      // Si el pago no está 'done', no hacemos nada, pero devolvemos 200 para que Khipu deje de reintentar
      return NextResponse.json({ received: true, status: paymentData.status }, { status: 200 });
    }

    // 3. Cruzar con nuestra base de datos (ERP)
    // El campo `transaction_id` en Khipu contiene nuestro ID de Firestore (orderRef.id)
    const internalOrderId = paymentData.transaction_id;
    if (!internalOrderId) {
      console.error('[Webhook Khipu] El pago no tiene transaction_id asociado.');
      return NextResponse.json({ error: 'Missing transaction_id' }, { status: 400 });
    }

    const db = getErpDbAdmin();
    const orderRef = db.collection('orders').doc(internalOrderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      console.error(`[Webhook Khipu] Orden ${internalOrderId} no encontrada en ERP.`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const currentOrderData = orderDoc.data()!;
    
    // Evitar procesar el pago dos veces (Idempotencia)
    if (currentOrderData.status === 'completed' || currentOrderData.payment?.status === 'paid') {
      console.log(`[Webhook Khipu] Orden ${internalOrderId} ya estaba marcada como pagada.`);
      return NextResponse.json({ received: true, message: 'Already processed' }, { status: 200 });
    }

    // 4. Actualizar Estado de la Orden en Firestore
    await orderRef.update({
      status: 'completed', // Estado logístico
      'payment.status': 'paid', // Estado financiero
      'payment.providerId': paymentData.payment_id,
      'payment.conciliationDate': paymentData.conciliation_date || Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now()
    });

    console.log(`[Webhook Khipu] ✅ Orden ${internalOrderId} marcada como PAGADA exitosamente.`);

    // 5. [Opcional Futuro] Disminuir Stock Físico (Inventario)
    // Se debería iterar sobre `currentOrderData.items` y hacer una transacción en `inventory`
    // para descontar el stock, asegurando consistencia.

    // Responder a Khipu con 200 OK para que sepa que recibimos el mensaje
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('[Webhook Khipu] Error Crítico Procesando Webhook:', error);
    // Devolvemos 500 para que Khipu intente enviarnos la notificación de nuevo más tarde (hasta por 2 días)
    return NextResponse.json({ error: 'Internal Webhook Error' }, { status: 500 });
  }
}

/**
 * Método no soportado. Khipu solo usa POST para webhooks.
 */
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
