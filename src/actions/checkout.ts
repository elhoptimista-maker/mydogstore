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

function generateFriendlyOrderId(): string {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `ORD-${timestamp}${randomChars}`;
}

export async function processCheckout(params: CheckoutParams) {
  const { idToken, customer, items, shipping, billing, paymentMethod, total, createAccount, saveAddressName } = params;

  try {
    let userId: string | null = null;
    let validatedEmail = customer.email;
    let userName = customer.name;

    const erpDb = getErpDbAdmin();
    const storefrontAuth = getStorefrontAuthAdmin();
    const storefrontDb = getStorefrontDbAdmin();

    if (idToken) {
      const decodedToken = await storefrontAuth.verifyIdToken(idToken);
      userId = decodedToken.uid;
      validatedEmail = decodedToken.email || customer.email;
      userName = customer.name; 
    } else if (createAccount) {
      try {
        const randomPassword = Math.random().toString(36).slice(-10) + "A1!x"; 
        const newUser = await storefrontAuth.createUser({
          email: validatedEmail,
          displayName: userName,
          password: randomPassword
        });
        userId = newUser.uid;

        await storefrontDb.collection("users").doc(userId).set({
          uid: userId,
          email: validatedEmail,
          displayName: userName,
          role: 'customer',
          phone: customer.phone,
          createdAt: Timestamp.now(),
          addresses: [{
            id: 'default',
            name: saveAddressName || 'Principal',
            streetAndNumber: shipping.streetAndNumber,
            apartmentOrLocal: shipping.apartmentOrLocal || '',
            commune: shipping.commune,
            region: shipping.region,
            isDefault: true
          }]
        });
      } catch (err) {
        userId = "guest";
      }
    } else {
      userId = "guest";
    }

    if (userId !== "guest" && idToken && saveAddressName) {
      const userRef = storefrontDb.collection("users").doc(userId);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        const addresses = userData?.addresses || [];
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

    const orderRef = erpDb.collection("orders").doc();
    const friendlyOrderId = generateFriendlyOrderId();
    const orderType = items.some(i => i.cartType === 'wholesale') ? 'wholesale' : 'retail';

    // Se inicializa el objeto de pago con los tipos correctos para evitar errores de TS (null vs string)
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
      payment: {
        method: paymentMethod,
        status: "pending_payment",
        providerId: "" as string | null,
        paymentUrl: "" as string | null
      },
      totalAmount: total,
      status: "pending_payment",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      source: "ecommerce_web"
    };

    let paymentUrl = null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (paymentMethod === "khipu") {
      const khipuResponse = await KhipuService.createPayment({
        amount: total,
        currency: "CLP",
        subject: `Pago de Orden ${friendlyOrderId} - MyDog`,
        transaction_id: orderRef.id, 
        payer_email: validatedEmail,
        payer_name: userName,
        return_url: `${baseUrl}/checkout/status?order=${orderRef.id}`,
        cancel_url: `${baseUrl}/checkout/status?order=${orderRef.id}&canceled=true`,
        notify_url: `${baseUrl}/api/webhooks/khipu` 
      });

      orderData.payment.providerId = khipuResponse.payment_id;
      orderData.payment.paymentUrl = khipuResponse.payment_url;
      paymentUrl = khipuResponse.payment_url;
    }

    await orderRef.set(orderData);

    return { 
      success: true, 
      orderId: orderRef.id,
      friendlyOrderId,
      paymentUrl,
      createdAccount: createAccount && userId !== "guest",
      message: paymentUrl ? "Redirigiendo..." : "Orden registrada." 
    };

  } catch (error: any) {
    console.error("[CheckoutAction] Error:", error);
    return { success: false, error: error.message || "Fallo crítico." };
  }
}
