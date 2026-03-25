import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * @fileOverview Endpoint de revalidación de caché bajo demanda.
 * Permite que el ERP notifique cambios en el inventario o precios, 
 * refrescando el catálogo del e-commerce instantáneamente sin esperar a que expire el TTL.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, tag } = body;
    
    // 1. Validación de seguridad mediante token compartido (REVALIDATION_SECRET)
    if (secret !== process.env.REVALIDATION_SECRET) {
      console.warn('[Revalidate API] Intento de acceso no autorizado con secret inválido');
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // 2. Revalidación por tag
    // Por defecto revalidamos 'catalog', pero permitimos pasar otros tags si la arquitectura crece
    const tagToRevalidate = tag || 'catalog';
    revalidateTag(tagToRevalidate);

    console.log(`[Revalidate API] ✅ Caché invalidado exitosamente para el tag: ${tagToRevalidate}`);
    
    return NextResponse.json({ 
      revalidated: true, 
      tag: tagToRevalidate,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('[Revalidate API] Error procesando la revalidación:', err.message);
    return NextResponse.json({ message: 'Error interno en el servidor de revalidación' }, { status: 500 });
  }
}

/**
 * Los webhooks de revalidación deben ser peticiones POST seguras.
 */
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed. Use POST with security token.' }, { status: 405 });
}
