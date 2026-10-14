import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../../organisms/header';
import { MobileNav } from '../../organisms/mobile-nav';
import { ToastContainer } from '../../organisms/toast-container';

/**
 * Template: App Shell (`ui-app-shell`).
 * - Layout principal autenticado con barra de cabecera, menú móvil, router-outlet y toasts flotantes.
 */
@Component({
  selector: 'ui-app-shell',
  imports: [RouterOutlet, Header, MobileNav, ToastContainer],
  templateUrl: './app-shell.html',
})
export class AppShell {
  readonly isMobileMenuOpen = signal(false);
}
