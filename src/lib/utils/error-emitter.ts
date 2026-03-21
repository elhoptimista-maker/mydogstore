type ErrorPayload = {
  message: string;
  code?: string;
  details?: any;
  context?: string;
};

type EventCallback = (payload: ErrorPayload) => void;

class ErrorEmitter {
  private listeners: EventCallback[] = [];

  subscribe(callback: EventCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  emit(payload: ErrorPayload) {
    // En producción, esto enviaría el error a Sentry, Datadog, etc.
    console.error(`[GlobalErrorEmitter] 🚨 Error capturado en: ${payload.context || 'Desconocido'}`);
    console.error(`Mensaje: ${payload.message}`);
    if (payload.code) console.error(`Código: ${payload.code}`);
    if (payload.details) console.error(`Detalles:`, payload.details);

    this.listeners.forEach((listener) => listener(payload));
  }
}

export const globalErrorEmitter = new ErrorEmitter();
