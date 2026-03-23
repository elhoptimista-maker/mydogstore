'use server';

/**
 * @fileOverview Server Action para recuperar pedidos del usuario desde el ERP.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";

export interface UserOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  itemsCount: number;
}

/**
 * Busca todos los pedidos asociados al UID de un usuario en el ERP.
 */
export async function fetchUserOrders(userId: string): Promise<UserOrder[]> {
  try {
    const db = getErpDbAdmin();
    const snapshot = await db.collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    if (!snapshot || snapshot.empty) return [];

    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        totalAmount: data.totalAmount || 0,
        status: data.status || 'pending',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        itemsCount: (data.items || []).length
      };
    });
  } catch (error) {
    return [];
  }
}
