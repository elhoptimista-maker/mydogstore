"use server";

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";
import { getStorefrontAuthAdmin, getStorefrontDbAdmin } from "@/lib/firebase/storefront-admin";
import { Timestamp } from "firebase-admin/firestore";
import { KhipuService } from "@/lib/services/payments/khipu.service";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  cartType: 'retail' | 'wholesale';
}

interface ShippingInfo {
  streetAndNumber: string;
  apartmentOrLocal?: string;
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
  idToken?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: CheckoutItem[];
  shipping: ShippingInfo;
  billing: BillingInfo;
  paymentMethod: string;
  total: number;
  createAccount?: boolean;
  saveAddressName?: string;
}

/**
 * Genera un ID de orden amigable con prefijo de marca.
 */
function generateFriendlyOrderId(): string {
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `MD-${timestamp}${randomChars}`;
}

/**
 * Server Action para procesar el checkout de forma segura y persistente.
 */
export async function processCheckout(params: CheckoutParams) {
  const { idToken, customer, items, shipping, billing, paymentMethod, total, createAccount, saveAddressName } = params;

  try {
    const erpDb = getErpDbAdmin();
    const storefrontAuth = getStorefrontAuthAdmin();
    const storefrontDb = getStorefrontDbAdmin();

    // TODO: Implementar calculateRealTotal para validar que 'total' no fue manipulado en el frontend
    
    let userId: string | null = null;
    let validatedEmail = customer.email;
    let userName = customer.name;

    // 1. GESTIÓN DE IDENTIDAD DEL USUARIO
    if (idToken) {
      // Usuario autenticado: Verificamos sesión
      const decodedToken = await storefrontAuth.verifyIdToken(idToken);
      userId = decodedToken.uid;
      validatedEmail = decodedToken.email || customer.email;
      userName = customer.name; 
    } else if (createAccount) {
      // Registro de nueva cuenta: Generamos cuenta y link de bienvenida
      try {
        const randomPassword = Math.random().toString(36).slice(-12) + "Myd0g!2024"; 
        const newUser = await storefrontAuth.createUser({
          email: validatedEmail,
          displayName: userName,
          password: randomPassword
        });
        userId = newUser.uid;

        // Generamos link para que el usuario setee su clave real (UX Crítica)
        const resetLink = await storefrontAuth.generatePasswordResetLink(validatedEmail);
        // Aquí se dispararía un correo electrónico en producción
        console.log(`[AUTH] Invitación enviada a ${validatedEmail}. Link: ${resetLink}`);

        await storefrontDb.collection("users").doc(userId).set({
          uid: userId,
          email: validatedEmail,
          displayName: userName,
          role: 'customer',
          phone: customer.phone,
          createdAt: Timestamp.now(),
          addresses: [{
            id: 'default',
            name: saveAddressName || 'Casa',
            streetAndNumber: shipping.streetAndNumber,
            apartmentOrLocal: shipping.apartmentOrLocal || '',
            commune: shipping.commune,
            region: shipping.region,
            isDefault: true
          }]
        });
      } catch (err: any) {
        console.warn("[Checkout] No se pudo crear la cuenta automática, continuando como invitado.", err.message);
        userId = "guest";
      }
    } else {
      userId = "guest";
    }

    // 2. ACTUALIZACIÓN DE DIRECCIONES PARA USUARIOS LOGUEADOS
    if (userId !== "guest" && idToken && saveAddressName) {
      const userRef = storefrontDb.collection("users").doc(userId);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        const addresses = userData?.addresses || [];
        // Evitamos duplicados por nombre de etiqueta
        if (!addresses.some((a: any) => a.name.toLowerCase() === saveAddressName.toLowerCase())) {
          const newAddress = {
            id: Math.random().toString(36).substring(2, 9),
            name: saveAddressName,
            streetAndNumber: shipping.streetAndNumber,
            apartmentOrLocal: shipping.apartmentOrLocal || '',
            commune: shipping.commune,
            region: shipping.region,
            isDefault: addresses.length === 0
          };
          await userRef.update({ addresses: [...addresses, newAddress] });
        }
      }
    }

    // 3. PREPARACIÓN DE LA ORDEN (Persistencia Preventiva)
    const orderRef = erpDb.collection("orders").doc();
    const friendlyOrderId = generateFriendlyOrderId();
    const orderType = items.some(i => i.cartType === 'wholesale') ? 'wholesale' : 'retail';

    const orderData: any = {
      orderId: friendlyOrderId,
      firestoreId: orderRef.id,
      userId,
      orderType,
      customer: {
        name: userName,
        email: validatedEmail,
        phone: customer.phone
      },
      items,
      shipping: {
        address: `${shipping.streetAndNumber} ${shipping.apartmentOrLocal || ''}`.trim(), 
        streetAndNumber: shipping.streetAndNumber,
        apartmentOrLocal: shipping.apartmentOrLocal || '',
        commune: shipping.commune,
        region: shipping.region,
        method: shipping.method,
        cost: shipping.cost || 0
      },
      // CORRECCIÓN TRIBUTARIA: Persistimos datos de factura/boleta
      billing: {
        type: billing.type,
        rut: billing.rut || null,
        companyName: billing.companyName || null,
        businessLine: billing.businessLine || null,
        address: billing.address || null
      },
      payment: {
        method: paymentMethod,
        status: "pending_payment",
        providerId: null,
        paymentUrl: null
      },
      totalAmount: total,
      status: "pending_payment",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      source: "ecommerce_web"
    };

    // Guardamos la orden ANTES de llamar a la pasarela (Rescate de carritos abandonados)
    await orderRef.set(orderData);

    // 4. INTEGRACIÓN CON PASARELA DE PAGO (Khipu)
    let paymentUrl = null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (paymentMethod === "khipu") {
      try {
        const khipuResponse = await KhipuService.createPayment({
          amount: total,
          currency: "CLP",
          subject: `Orden ${friendlyOrderId} - MyDog Distribuidora`,
          transaction_id: orderRef.id, 
          payer_email: validatedEmail,
          payer_name: userName,
          return_url: `${baseUrl}/checkout/status?order=${orderRef.id}`,
          cancel_url: `${baseUrl}/checkout/status?order=${orderRef.id}&canceled=true`,
          notify_url: `${baseUrl}/api/webhooks/khipu` 
        });

        paymentUrl = khipuResponse.payment_url;
        
        // Actualizamos la orden con los metadatos de la pasarela
        await orderRef.update({
          "payment.providerId": khipuResponse.payment_id,
          "payment.paymentUrl": khipuResponse.payment_url,
          updatedAt: Timestamp.now()
        });

      } catch (khipuError: any) {
        console.error("[Khipu Service Error]:", khipuError.message);
        // No lanzamos error fatal porque la orden ya está guardada para gestión manual
        throw new Error("Tuvimos un problema al conectar con tu banco. Por favor intenta de nuevo.");
      }
    }

    return { 
      success: true, 
      orderId: orderRef.id,
      friendlyOrderId,
      paymentUrl,
      createdAccount: createAccount && userId !== "guest",
      message: paymentUrl ? "Redirigiendo al portal de pago..." : "Orden registrada exitosamente." 
    };

  } catch (error: any) {
    console.error("[CheckoutAction Fatal Error]:", error);
    return { success: false, error: error.message || "Error interno al procesar el pedido." };
  }
}
