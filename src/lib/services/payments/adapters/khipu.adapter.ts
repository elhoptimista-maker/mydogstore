import { PaymentProvider, PaymentTransactionParams } from '../payment.interface';

export class KhipuAdapter implements PaymentProvider {
  private readonly API_URL = 'https://payment-api.khipu.com/v3';
  
  private getHeaders() {
    const apiKey = process.env.KHIPU_API_KEY;
    if (!apiKey) throw new Error("KHIPU_API_KEY no configurada en las variables de entorno.");
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': apiKey
    };
  }

  async createTransaction(params: PaymentTransactionParams): Promise<string> {
    const response = await fetch(`${this.API_URL}/payments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        amount: params.amount,
        currency: 'CLP',
        subject: `Pedido MyDog #${params.orderId.slice(-6).toUpperCase()}`,
        transaction_id: params.orderId,
        payer_email: params.email,
        payer_name: params.name,
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        notify_url: params.notifyUrl,
        send_email: false,
        send_reminders: false,
        notify_api_version: '3.0'
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Khipu API Error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.payment_url;
  }

  async processWebhook(req: Request): Promise<{ isValid: boolean, orderId?: string, isPaid?: boolean, paymentMethod?: string }> {
    try {
      const formData = await req.formData();
      const notificationToken = formData.get('notification_token') as string;

      if (!notificationToken) return { isValid: false };

      const response = await fetch(`${this.API_URL}/payments?notification_token=${notificationToken}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) return { isValid: false };

      const paymentData = await response.json();
      
      return {
        isValid: true,
        orderId: paymentData.transaction_id, 
        isPaid: paymentData.status === 'done',
        paymentMethod: 'TRANSFER'
      };
    } catch (error) {
      console.error("[KhipuAdapter] Error procesando webhook:", error);
      return { isValid: false };
    }
  }
}
