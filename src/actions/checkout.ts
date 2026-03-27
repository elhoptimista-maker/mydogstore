"use server";

import { PaymentFactory } from "@/lib/services/payments/payment.factory";

/**
 * @fileOverview Server Action ultraligero para el procesamiento de pedidos.
 * Implementa la regla tributaria obligatoria: usa RUT Empresa para Facturas 
 * y RUT Personal para Boletas. Nunca envía valores vacíos al ERP.
 */
export async function processCheckout(params: any) {
  const { userId, customer, items, shipping, billing, paymentMethod, total } = params;

  try {
    // REGLA TRIBUTARIA: Si piden FACTURA, usamos el RUT y Nombre de la Empresa. 
    // Si piden BOLETA, usamos el RUT Personal y Nombre Personal obligatorios.
    const finalDocumentType = billing.type === 'factura' ? 'FACTURA' : 'COMPROBANTE_VENTA';
    
    const finalRut = billing.type === 'factura' && billing.rut 
      ? billing.rut 
      : customer.rut; // Obligatorio desde el frontend

    const finalName = billing.type === 'factura' && billing.companyName 
      ? billing.companyName 
      : customer.name;

    if (!finalRut) {
      throw new Error("Se requiere un RUT válido para procesar el pedido. Por favor revisa los datos de contacto.");
    }

    // 1. PAYLOAD PARA EL GATEWAY DEL ERP
    const erpPayload = {
      customerId: userId || "guest",
      customerName: finalName,
      customerRut: finalRut,
      customerAddress: `${shipping.streetAndNumber} ${shipping.apartmentOrLocal || ''}, ${shipping.commune}, ${shipping.region}`.trim(),
      customerPhone: customer.phone,
      sellerId: "ECOMMERCE_BOT",
      sellerName: "MyDog Store (Web)",
      total: total,
      totalWeight: 0,
      items: items.map((item: any) => ({
        productId: item.id,
        sku: item.sku || "N/A",
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      // Enviamos la intención tributaria en la nota para que el ERP la procese luego
      paymentNote: `REQ_DOC:${finalDocumentType}`,
    };

    // 2. CREACIÓN DE ORDEN VÍA API DEL ERP (DRAFT)
    const erpApiUrl = process.env.ERP_API_URL || "http://localhost:3000";
    const erpSecret = process.env.ECOMMERCE_API_SECRET;

    const erpResponse = await fetch(`${erpApiUrl}/api/webhooks/order-created`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${erpSecret}` 
      },
      body: JSON.stringify(erpPayload)
    });

    if (!erpResponse.ok) {
      const errorData = await erpResponse.json().catch(() => ({}));
      throw new Error(errorData.error || "El sistema central rechazó el pedido (Posible quiebre de stock).");
    }

    const erpData = await erpResponse.json();
    const orderId = erpData.orderId; // El ERP nos devuelve el ID oficial

    // 3. PASARELA DE PAGO AGNÓSTICA (PATRÓN ADAPTER)
    let paymentUrl = null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Solo procesamos pasarelas externas
    if (paymentMethod !== 'credit_line' && paymentMethod !== 'efectivo') {
      try {
        const paymentProvider = PaymentFactory.getProvider(paymentMethod);
        
        paymentUrl = await paymentProvider.createTransaction({
          orderId: orderId,
          amount: total,
          email: customer.email,
          name: customer.name,
          returnUrl: `${baseUrl}/checkout/status?order=${orderId}`,
          cancelUrl: `${baseUrl}/checkout/status?order=${orderId}&canceled=true`,
          // LE INYECTAMOS EL TIPO DE DOCUMENTO A LA URL DE NOTIFICACIÓN
          notifyUrl: `${baseUrl}/api/webhooks/payments/${paymentMethod}?docType=${finalDocumentType}` 
        });
        
      } catch (paymentError: any) {
        console.error("Error en Pasarela:", paymentError);
        throw new Error("El proveedor de pagos no está disponible en este momento.");
      }
    }

    return { 
      success: true, 
      orderId: orderId,
      paymentUrl,
      message: paymentUrl ? "Redirigiendo a pasarela segura..." : "Orden registrada." 
    };

  } catch (error: any) {
    console.error("[CheckoutAction] Error fatal:", error);
    return { success: false, error: error.message || "Fallo crítico en el servidor." };
  }
}