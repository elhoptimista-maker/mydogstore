"use server";

import { getErpDbAdmin, getErpAuthAdmin } from "@/lib/firebase/erp-admin";
import { Timestamp } from "firebase-admin/firestore";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutParams {
  idToken: string;
  items: CheckoutItem[];
  total: number;
  shippingAddress: string;
}

/**
 * Procesa la orden de compra verificando la identidad del usuario y guardando en el ERP.
 */
export async function processCheckout(params: CheckoutParams) {
  const { idToken, items, total, shippingAddress } = params;

  try {
    const auth = getErpAuthAdmin();
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
      throw new Error("Usuario no autenticado para transacciones.");
    }

    const db = getErpDbAdmin();
    const orderRef = db.collection("orders").doc();
    
    const orderData = {
      orderId: orderRef.id,
      userId,
      customerEmail: decodedToken.email,
      items,
      totalAmount: total,
      status: "pending_payment",
      shippingAddress,
      createdAt: Timestamp.now(),
      source: "ecommerce_web"
    };

    await orderRef.set(orderData);

    return { 
      success: true, 
      orderId: orderRef.id,
      message: "Orden procesada exitosamente en el ERP." 
    };

  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Error interno al procesar la compra." 
    };
  }
}