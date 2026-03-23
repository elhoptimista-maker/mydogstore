'use server';

/**
 * @fileOverview Server Action para recuperar la lista de comunas desde el ERP.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";

/**
 * Obtiene los nombres de las comunas disponibles para despacho.
 * Se utiliza el campo 'name' del documento en lugar del ID para obtener el nombre formateado.
 */
export async function fetchCommunes(): Promise<string[]> {
  try {
    const db = getErpDbAdmin();
    const snapshot = await db.collection("map_communes").get();
    
    if (!snapshot || snapshot.empty) return [];

    // Mapeamos al campo 'name' y usamos el ID como fallback si no existe
    return snapshot.docs
      .map((doc: any) => {
        const data = doc.data();
        return (data.name || doc.id) as string;
      })
      .sort((a, b) => a.localeCompare(b));
  } catch (error: any) {
    console.error("[CommunesAction] Error fetching communes from ERP:", error.message);
    return [];
  }
}
