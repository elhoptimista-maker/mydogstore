import { PaymentProvider } from './payment.interface';
import { KhipuAdapter } from './adapters/khipu.adapter';

export class PaymentFactory {
  static getProvider(methodId: string): PaymentProvider {
    switch (methodId) {
      case 'khipu':
        return new KhipuAdapter();
      // Aquí agregaremos WebpayAdapter o MercadoPagoAdapter en el futuro
      default:
        throw new Error(`Método de pago '${methodId}' no soportado.`);
    }
  }
}
