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
    // Eliminamos filtros restrictivos de 'origin' para asegurar que aparezcan todos los pedidos
    const snapshot = await db.collection("orders")
      .where("customerId", "==", userId)
      .orderBy("createdAt", "desc") // Los más recientes primero
      .limit(20)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      const orderId = doc.id;
      
      // Lógica de detección de tipo de documento solicitado
      let docType = 'BOLETA';
      if (data.billing?.type === 'factura' || data.paymentNote?.includes('REQ_DOC:FACTURA')) {
        docType = 'FACTURA';
      }

      return {
        id: orderId,
        friendlyOrderId: data.friendlyOrderId || data.orderId || orderId.slice(-6).toUpperCase(),
        status: data.status || 'pending_payment',
        // El ERP puede usar total o totalAmount dependiendo del estado de la orden
        total: data.totalAmount || data.total || 0,
        documentRequested: docType,
        // Si el ERP generó el PDF en bsaleDocument o similar, lo pasamos al frontend
        urlPdf: data.bsaleDocument?.urlPdf || data.urlPdf || null, 
        items: data.items || [],
        createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : null
      };
    });
    
  } catch (error) {
    console.error("[OrdersAction] Error obteniendo historial:", error);
    return [];
  }
}
