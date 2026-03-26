"use server";

import { getStorefrontAuthAdmin, getStorefrontDbAdmin } from "@/lib/firebase/storefront-admin";
import { Timestamp } from "firebase-admin/firestore";
import { PaymentFactory } from "@/lib/services/payments/payment.factory";

interface CheckoutItem {
  id: string;
  sku?: string;
  name: string;
  quantity: number;
  price: number;
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

export async function processCheckout(params: CheckoutParams) {
  const { idToken, customer, items, shipping, billing, paymentMethod, total, createAccount, saveAddressName } = params;

  try {
    const storefrontAuth = getStorefrontAuthAdmin();
    const storefrontDb = getStorefrontDbAdmin();

    let userId = "guest";
    let validatedEmail = customer.email;
    let userName = customer.name;

    // 1. GESTIÓN DE USUARIO LOCAL (Storefront)
    if (idToken) {
      const decodedToken = await storefrontAuth.verifyIdToken(idToken);
      userId = decodedToken.uid;
      validatedEmail = decodedToken.email || customer.email;
      userName = customer.name; 
    } else if (createAccount) {
      try {
        const randomPassword = Math.random().toString(36).slice(-12) + "Myd0g!"; 
        const newUser = await storefrontAuth.createUser({ email: validatedEmail, displayName: userName, password: randomPassword });
        userId = newUser.uid;

        await storefrontDb.collection("users").doc(userId).set({
          uid: userId, email: validatedEmail, displayName: userName, role: 'customer', phone: customer.phone, createdAt: Timestamp.now(),
          addresses: [{
            id: 'default', name: saveAddressName || 'Casa', streetAndNumber: shipping.streetAndNumber, apartmentOrLocal: shipping.apartmentOrLocal || '', commune: shipping.commune, region: shipping.region, isDefault: true
          }]
        });
      } catch (err) {
        userId = "guest";
      }
    } else {
      userId = "guest";
    }

    // Guardar dirección adicional si es usuario logueado
    if (userId !== "guest" && idToken && saveAddressName) {
      const userRef = storefrontDb.collection("users").doc(userId);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        const addresses = userData?.addresses || [];
        if (!addresses.some((a: any) => a.name.toLowerCase() === saveAddressName.toLowerCase())) {
          const newAddress = {
            id: Math.random().toString(36).substring(2, 9), name: saveAddressName, streetAndNumber: shipping.streetAndNumber, apartmentOrLocal: shipping.apartmentOrLocal || '', commune: shipping.commune, region: shipping.region, isDefault: addresses.length === 0
          };
          await userRef.update({ addresses: [...addresses, newAddress] });
        }
      }
    }

    // 2. PAYLOAD PARA EL GATEWAY DEL ERP
    const erpPayload = {
      customerId: userId,
      customerName: billing.type === 'factura' && billing.companyName ? billing.companyName : userName,
      customerRut: billing.rut || "N/A",
      customerAddress: `${shipping.streetAndNumber} ${shipping.apartmentOrLocal || ''}, ${shipping.commune}, ${shipping.region}`.trim(),
      customerPhone: customer.phone,
      sellerId: "ECOMMERCE_BOT",
      sellerName: "MyDog Store (Web)",
      total: total,
      totalWeight: 0,
      items: items.map((item: any) => ({
        productId: item.id,
        sku: item.sku || "N/A",
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentNote: `REQ_DOC:${billing.type.toUpperCase()}`,
    };

    // 3. CREACIÓN DE ORDEN VÍA API DEL ERP
    const erpApiUrl = process.env.ERP_API_URL || "http://localhost:3000";
    const erpSecret = process.env.ECOMMERCE_API_SECRET;

    const erpResponse = await fetch(`${erpApiUrl}/api/webhooks/order-created`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${erpSecret}` },
      body: JSON.stringify(erpPayload)
    });

    if (!erpResponse.ok) {
      const errorData = await erpResponse.json().catch(() => ({}));
      throw new Error(errorData.error || "El sistema central rechazó el pedido (Posible quiebre de stock).");
    }

    const erpData = await erpResponse.json();
    const orderId = erpData.orderId; 

    // 4. PASARELA DE PAGO AGNÓSTICA
    let paymentUrl = null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (paymentMethod !== 'credit_line' && paymentMethod !== 'efectivo') {
      try {
        const paymentProvider = PaymentFactory.getProvider(paymentMethod);
        
        paymentUrl = await paymentProvider.createTransaction({
          orderId: orderId,
          amount: total,
          email: validatedEmail,
          name: userName,
          returnUrl: `${baseUrl}/checkout/status?order=${orderId}`,
          cancelUrl: `${baseUrl}/checkout/status?order=${orderId}&canceled=true`,
          notifyUrl: `${baseUrl}/api/webhooks/payments/${paymentMethod}` 
        });
        
      } catch (paymentError: any) {
        console.error("Error en Pasarela:", paymentError);
        throw new Error("El proveedor de pagos no está disponible en este momento.");
      }
    }

    return { 
      success: true, 
      orderId: orderId,
      paymentUrl,
      message: paymentUrl ? "Redirigiendo a pasarela segura..." : "Orden registrada." 
    };

  } catch (error: any) {
    console.error("[CheckoutAction] Error fatal:", error);
    return { success: false, error: error.message || "Fallo crítico en el servidor." };
  }
}