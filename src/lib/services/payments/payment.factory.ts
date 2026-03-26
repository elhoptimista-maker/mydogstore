import { PaymentProvider } from './payment.interface';
import { KhipuAdapter } from './adapters/khipu.adapter';
import { MockAdapter } from './adapters/mock.adapter';

export class PaymentFactory {
  static getProvider(methodId: string): PaymentProvider {
    switch (methodId) {
      case 'khipu':
        return new KhipuAdapter();
      case 'mock':
        return new MockAdapter();
      default:
        throw new Error(`Método de pago '${methodId}' no soportado.`);
    }
  }
}
