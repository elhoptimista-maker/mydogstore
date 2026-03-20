
"use server";

import { getErpDbAdmin, getErpAuthAdmin } from "@/lib/firebase/erp-admin";
import { Timestamp } from "firebase-admin/firestore";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface ShippingInfo {
  address: string;
  commune: string;
  region: string;
  method: string;
  cost: number;
}

interface BillingInfo {
  type: 'boleta' | 'factura';
  rut?: string;
  companyName?: string;
  businessLine?: string;
  address?: string;
}

interface CheckoutParams {
  idToken: string;
  customer: {
    name: string;
    phone: string;
  };
  items: CheckoutItem[];
  shipping: ShippingInfo;
  billing: BillingInfo;
  paymentMethod: string;
  total: number;
}

/**
 * Procesa la orden de compra verificando la identidad del usuario y guardando la información detallada en el ERP.
 */
export async function processCheckout(params: CheckoutParams) {
  const { idToken, customer, items, shipping, billing, paymentMethod, total } = params;

  try {
    const auth = getErpAuthAdmin();
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    if (!userId) {
      throw new Error("Sesión expirada o inválida. Por favor, reingresa.");
    }

    const db = getErpDbAdmin();
    const orderRef = db.collection("orders").doc();
    
    const orderData = {
      orderId: orderRef.id,
      userId,
      customer: {
        name: customer.name,
        email: email,
        phone: customer.phone
      },
      items,
      shipping: {
        ...shipping,
        cost: shipping.cost || 0
      },
      billing,
      payment: {
        method: paymentMethod,
        status: "pending_payment",
        transactionId: null
      },
      totalAmount: total,
      status: "pending_payment",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      source: "ecommerce_web"
    };

    await orderRef.set(orderData);

    return { 
      success: true, 
      orderId: orderRef.id,
      message: "Tu pedido ha sido recibido y está pendiente de pago." 
    };

  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "No pudimos procesar tu pedido en este momento." 
    };
  }
}
