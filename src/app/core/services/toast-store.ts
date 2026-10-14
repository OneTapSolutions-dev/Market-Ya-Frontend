import { Service, signal } from '@angular/core';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastVariant;
  title: string;
  message: string;
}

/**
 * Servicio raíz para gestionar notificaciones flotantes (Toasts).
 */
@Service()
export class ToastStore {
  private readonly _toasts = signal<ToastMessage[]>([]);

  readonly toasts = this._toasts.asReadonly();

  addToast(type: ToastVariant, title: string, message: string, duration = 4500): string {
    const id = Math.random().toString(36).substring(2, 9);
    this._toasts.update((list) => [...list, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }
    return id;
  }

  success(title: string, message: string): string {
    return this.addToast('success', title, message);
  }

  warning(title: string, message: string): string {
    return this.addToast('warning', title, message);
  }

  error(title: string, message: string): string {
    return this.addToast('error', title, message);
  }

  info(title: string, message: string): string {
    return this.addToast('info', title, message);
  }

  removeToast(id: string): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
