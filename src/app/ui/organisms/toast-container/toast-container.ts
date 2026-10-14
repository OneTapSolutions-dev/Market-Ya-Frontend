import { Component, inject } from '@angular/core';

import { ToastStore } from '../../../core/services/toast-store';
import { Icon } from '../../atoms/icon';

/**
 * Organismo: Contenedor global de notificaciones Toast (`ui-toast-container`).
 * - Se conecta con `ToastStore` y muestra la pila de notificaciones en la esquina inferior derecha.
 */
@Component({
  selector: 'ui-toast-container',
  imports: [Icon],
  templateUrl: './toast-container.html',
})
export class ToastContainer {
  readonly toastStore = inject(ToastStore);
  readonly toasts = this.toastStore.toasts;

  remove(id: string): void {
    this.toastStore.removeToast(id);
  }
}
