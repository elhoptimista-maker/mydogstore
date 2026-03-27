"use server";

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";

/**
 * @fileOverview Server Action para recuperar el historial de pedidos desde el ERP.
 * Se asoma a la base de datos central filtrando por el UID del usuario del e-commerce.
 */

export interface UserOrder {
  id: string;
  friendlyOrderId: string;
  status: string;
  total: number;
  documentRequested: string;
  urlPdf: string | null;
  items: any[];
  createdAt: string | null;
}

/**
 * Obtiene el historial de pedidos de un usuario directamente desde el ERP.
 * Se ejecuta de forma segura en el servidor del E-commerce.
 */
export async function getUserOrderHistory(userId: string): Promise<UserOrder[]> {
  if (!userId || userId === 'guest') return [];

  try {
    const db = getErpDbAdmin();
    
    // Consultamos directamente al ERP filtrando por el UID del cliente web (customerId)
    const snapshot = await db.collection("orders")
      .where("customerId", "==", userId)
      .orderBy("createdAt", "desc") // Los más recientes primero
      .limit(20)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => {
      const data = doc.data();
      const orderId = doc.id;
      return {
        id: orderId,
        friendlyOrderId: data.friendlyOrderId || orderId.slice(-6).toUpperCase(),
        status: data.status || 'pending_payment',
        total: data.total || data.totalAmount || 0,
        documentRequested: data.paymentNote?.includes('REQ_DOC:FACTURA') ? 'FACTURA' : 'BOLETA',
        // Si el ERP generó el PDF en bsaleDocument, lo pasamos al frontend
        urlPdf: data.bsaleDocument?.urlPdf || null, 
        items: data.items || [],
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
      };
    });
    
  } catch (error) {
    console.error("[OrdersAction] Error obteniendo historial:", error);
    return [];
  }
}
