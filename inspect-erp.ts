
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables desde .env.local específicamente para el ERP
config({ path: resolve(process.cwd(), '.env.local') });

import { getErpDbAdmin } from './src/lib/firebase/erp-admin';

async function inspectERPProducts() {
  console.log("🔍 Iniciando inspección de productos en ERP...");
  
  try {
    const db = getErpDbAdmin();
    const snapshot = await db.collection("products").limit(2).get();

    if (snapshot.empty) {
      console.log("❌ No se encontraron productos en la colección 'products'.");
      return;
    }

    snapshot.docs.forEach((doc: any, index: number) => {
      console.log(`\n📦 PRODUCTO #${index + 1} (ID: ${doc.id})`);
      console.log(JSON.stringify(doc.data(), null, 2));
    });

  } catch (error: any) {
    console.error("🔥 Error al inspeccionar ERP:", error.message);
  }
}

inspectERPProducts();
