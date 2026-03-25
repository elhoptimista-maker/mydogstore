/**
 * @fileOverview Servicio de Integración con la API de Khipu (v3.0).
 * Maneja la creación de pagos, consulta de estado y obtención de bancos disponibles.
 * Sigue los principios de Responsabilidad Única (SRP) y Clean Code.
 */

export interface KhipuPaymentParams {
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

export interface KhipuPaymentResponse {
  payment_id: string;
  payment_url: string;
  simplified_transfer_url: string;
  transfer_url: string;
  app_url: string;
  ready_for_terminal: boolean;
}

export interface KhipuBank {
  bank_id: string;
  name: string;
  message: string;
  min_amount: number;
  type: "Persona" | "Empresa";
  parent: string;
  logo_url?: string;
}

/**
 * Cliente de la API de Khipu.
 * Centraliza la comunicación con la pasarela de pagos asegurando consistencia en los headers y manejo de errores.
 */
export class KhipuService {
  private static readonly API_URL = 'https://payment-api.khipu.com/v3';
  
  /**
   * Genera los headers necesarios para la autenticación con Khipu.
   */
  private static getHeaders() {
    const apiKey = process.env.KHIPU_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ KHIPU_API_KEY no definida en las variables de entorno. Las peticiones podrían fallar.");
    }
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': apiKey || 'dummy-key-for-dev'
    };
  }

  /**
   * Crea un intento de pago en Khipu.
   * @param params Parámetros de la transacción según la especificación v3.0.
   */
  static async createPayment(params: KhipuPaymentParams): Promise<KhipuPaymentResponse> {
    try {
      const response = await fetch(`${this.API_URL}/payments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...params,
          send_email: false, // MyDog gestiona sus propias notificaciones
          send_reminders: false,
          notify_api_version: '3.0'
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error desconocido en la pasarela' }));
        throw new Error(`Khipu Create Error [${response.status}]: ${error.message || JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[KhipuService] Error crítico al crear el pago:", error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de bancos disponibles para la cuenta de cobro configurada.
   * Útil para mostrar logos o advertencias de montos mínimos en el checkout.
   */
  static async getBanks(): Promise<KhipuBank[]> {
    try {
      const response = await fetch(`${this.API_URL}/banks`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Khipu Banks Error [${response.status}]`);
      }

      const data = await response.json();
      return data.banks || [];
    } catch (error) {
      console.error("[KhipuService] Error al obtener lista de bancos:", error);
      return [];
    }
  }

  /**
   * Consulta el estado de un pago específico por su ID.
   * Método vital para la validación de seguridad en el Webhook.
   */
  static async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Khipu Status Error [${response.status}]`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[KhipuService] Error al consultar el pago ${paymentId}:`, error);
      throw error;
    }
  }
}
