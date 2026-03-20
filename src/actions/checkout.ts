
"use server";

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";
import { getStorefrontAuthAdmin } from "@/lib/firebase/storefront-admin";
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
 * Procesa la orden de compra verificando la identidad en el Storefront 
 * y guardando la información en el ERP.
 */
export async function processCheckout(params: CheckoutParams) {
  const { idToken, customer, items, shipping, billing, paymentMethod, total } = params;

  try {
    // 1. Validar identidad en el proyecto Storefront
    const storefrontAuth = getStorefrontAuthAdmin();
    const decodedToken = await storefrontAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    if (!userId) throw new Error("Sesión inválida.");

    // 2. Escribir en el proyecto ERP con privilegios administrativos
    const erpDb = getErpDbAdmin();
    const orderRef = erpDb.collection("orders").doc();
    
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
      message: "Orden registrada exitosamente en el ERP." 
    };

  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Fallo crítico en el procesamiento del pedido." 
    };
  }
}
