"use server";

import { PaymentFactory } from "@/lib/services/payments/payment.factory";

/**
 * @fileOverview Server Action ultraligero para el procesamiento de pedidos.
 * Actúa como puente entre el Storefront, el Gateway del ERP y las pasarelas de pago.
 */
export async function processCheckout(params: any) {
  const { userId, customer, items, shipping, billing, paymentMethod, total } = params;

  try {
    // 1. PAYLOAD PARA EL GATEWAY DEL ERP
    const erpPayload = {
      customerId: userId || "guest",
      customerName: billing.type === 'factura' && billing.companyName ? billing.companyName : customer.name,
      customerRut: billing.rut || "N/A",
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
      paymentNote: `REQ_DOC:${billing.type.toUpperCase()}`,
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

    // Solo procesamos pasarelas externas (excluyendo métodos internos como línea de crédito)
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
          notifyUrl: `${baseUrl}/api/webhooks/payments/${paymentMethod}` // Ruta dinámica agnóstica
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
