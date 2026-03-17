
"use client";

type ErrorListener = (error: AppError) => void;

export interface AppError {
  code: string;
  message: string;
  type: 'FIRESTORE_PERMISSION' | 'GENERIC' | 'AUTH';
  originalError?: any;
}

class GlobalErrorEmitter {
  private listeners: ErrorListener[] = [];

  subscribe(listener: ErrorListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(error: AppError) {
    this.listeners.forEach(listener => listener(error));
  }
}

export const errorEmitter = new GlobalErrorEmitter();

export function emitFirestoreError(originalError: any) {
  errorEmitter.emit({
    code: originalError.code || 'unknown',
    message: originalError.message || 'Access denied to Firestore resources.',
    type: 'FIRESTORE_PERMISSION',
    originalError
  });
}
