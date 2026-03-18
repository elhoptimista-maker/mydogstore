"use client";

/**
 * @fileOverview Emisor de errores global para capturar y notificar fallos de permisos en Firestore.
 */

export type FirestoreOperation = 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';

export interface SecurityRuleContext {
  path: string;
  operation: FirestoreOperation;
  requestResourceData?: any;
}

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  
  constructor(context: SecurityRuleContext) {
    super(`FirestoreError: Missing or insufficient permissions at ${context.path}`);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}

type ErrorListener = (error: FirestorePermissionError) => void;

class GlobalErrorEmitter {
  private listeners: ErrorListener[] = [];

  subscribe(listener: ErrorListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(channel: 'permission-error', error: FirestorePermissionError) {
    if (channel === 'permission-error') {
      this.listeners.forEach(listener => listener(error));
    }
  }
}

export const errorEmitter = new GlobalErrorEmitter();
