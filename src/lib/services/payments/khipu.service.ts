/**
 * @fileOverview Servicio de Integración con la API de Khipu (v3.0).
 * Maneja la creación de pagos y la consulta de estado.
 */

interface KhipuPaymentParams {
  amount: number;
  currency: string;
  subject: string;
  transaction_id: string;
  payer_email: string;
  payer_name: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
}

interface KhipuPaymentResponse {
  payment_id: string;
  payment_url: string;
  simplified_transfer_url: string;
  transfer_url: string;
  app_url: string;
  ready_for_terminal: boolean;
}

/**
 * Cliente de la API de Khipu.
 * Utiliza fetch nativo y lee la variable de entorno KHIPU_API_KEY.
 */
export class KhipuService {
  private static readonly API_URL = 'https://payment-api.khipu.com/v3';
  
  private static getApiKey(): string {
    const key = process.env.KHIPU_API_KEY;
    if (!key) {
      console.warn("⚠️ KHIPU_API_KEY no está definida en las variables de entorno.");
      return "dummy-key-for-dev"; // Solo para evitar crashes en dev si no está configurada
    }
    return key;
  }

  /**
   * Crea un intento de pago en Khipu.
   */
  static async createPayment(params: KhipuPaymentParams): Promise<KhipuPaymentResponse> {
    const apiKey = this.getApiKey();
    
    try {
      const response = await fetch(`${this.API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          ...params,
          send_email: false, // No queremos que Khipu envíe correos directamente, lo haremos nosotros
          send_reminders: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Khipu API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data as KhipuPaymentResponse;

    } catch (error) {
      console.error("[KhipuService] Error al crear el pago:", error);
      throw error;
    }
  }

  /**
   * Consulta el estado de un pago en Khipu por su ID.
   * Utilizado en el webhook para validar de forma segura que el pago es real.
   */
  static async getPaymentStatus(paymentId: string): Promise<any> {
    const apiKey = this.getApiKey();
    
    try {
      const response = await fetch(`${this.API_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'x-api-key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Khipu API Error: ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error(`[KhipuService] Error al consultar pago ${paymentId}:`, error);
      throw error;
    }
  }
}
