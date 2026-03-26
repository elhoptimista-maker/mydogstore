/**
 * @fileOverview Contrato universal para cualquier pasarela de pagos.
 */
export interface PaymentTransactionParams {
  orderId: string;
  amount: number;
  email: string;
  name: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

export interface PaymentProvider {
  /** Crea la intención de pago y devuelve la URL para redirigir al cliente */
  createTransaction(params: PaymentTransactionParams): Promise<string>;
  
  /** 
   * Procesa el webhook entrante del banco. 
   * Debe validar la seguridad criptográfica y devolver el ID de la orden y estado.
   */
  processWebhook(req: Request): Promise<{ isValid: boolean, orderId?: string, isPaid?: boolean, paymentMethod?: string }>;
}
