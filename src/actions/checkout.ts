"use server";

/**
 * @fileOverview Server Action para procesar compras y sincronizar con el ERP.
 * Incluye verificación estricta de identidad mediante tokens de Firebase.
 */

import { getErpAdminDb, getErpAdminAuth } from "@/lib/firebase/erp-admin";
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
    // 1. Verificación de Identidad (Regla de Oro de Seguridad)
    const auth = getErpAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
      throw new Error("Usuario no autenticado para transacciones.");
    }

    // 2. Preparar datos de la orden
    const db = getErpAdminDb();
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

    // 3. Escritura en el ERP con privilegios administrativos
    await orderRef.set(orderData);

    return { 
      success: true, 
      orderId: orderRef.id,
      message: "Orden procesada exitosamente en el ERP." 
    };

  } catch (error: any) {
    // Error Handling: La acción falla atómicamente si el token es inválido o falla la DB
    return { 
      success: false, 
      error: error.message || "Error interno al procesar la compra." 
    };
  }
}
