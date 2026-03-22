
'use server';

/**
 * @fileOverview Server Action para recuperar la lista de comunas desde el ERP.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";

/**
 * Obtiene los nombres de las comunas disponibles para despacho.
 * Según la arquitectura del ERP, el ID del documento es el nombre de la comuna.
 */
export async function fetchCommunes(): Promise<string[]> {
  try {
    const db = getErpDbAdmin();
    // Obtenemos todos los documentos de la colección map_communes
    const snapshot = await db.collection("map_communes").get();
    
    if (snapshot.empty) return [];

    // Retornamos los IDs de los documentos ordenados alfabéticamente
    return snapshot.docs.map(doc => doc.id).sort((a, b) => a.localeCompare(b));
  } catch (error: any) {
    console.error("[CommunesAction] Error fetching communes from ERP:", error.message);
    return [];
  }
}
