import { PaymentProvider, PaymentTransactionParams } from '../payment.interface';

export class MockAdapter implements PaymentProvider {
  async createTransaction(params: PaymentTransactionParams): Promise<string> {
    // En lugar de ir a un banco, redirigimos a una página local de nuestro propio e-commerce
    // Le pasamos los datos por URL para que la pantalla "finja" ser el banco
    return `/checkout/mock-payment?orderId=${params.orderId}&amount=${params.amount}&notifyUrl=${encodeURIComponent(params.notifyUrl)}`;
  }

  async processWebhook(req: Request): Promise<{ isValid: boolean, orderId?: string, isPaid?: boolean, paymentMethod?: string }> {
    try {
      // Leemos el JSON que nuestra propia pantalla de prueba nos enviará
      const data = await req.json();
      
      // Simulamos una validación de seguridad básica
      if (data.secretToken !== 'test-secret-123') {
        return { isValid: false };
      }

      return {
        isValid: true,
        orderId: data.orderId,
        isPaid: data.status === 'PAID',
        paymentMethod: 'TEST_MOCK'
      };
    } catch (error) {
      return { isValid: false };
    }
  }
}
