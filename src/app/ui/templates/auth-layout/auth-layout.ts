import { Component } from '@angular/core';

import { ToastContainer } from '../../organisms/toast-container';

/**
 * Template: Layout de autenticación (`ui-auth-layout`).
 * - Pantalla de inicio de sesión con degradado naranja superior y contenedor centrado.
 */
@Component({
  selector: 'ui-auth-layout',
  imports: [ToastContainer],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  onLogoError(event: Event): void {
    (event.target as HTMLElement).style.display = 'none';
  }
}
