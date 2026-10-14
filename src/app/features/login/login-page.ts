import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '../../core/services/store';
import { Icon } from '../../ui/atoms/icon';
import { AuthLayout } from '../../ui/templates/auth-layout';

/**
 * Página: Autenticación y selección de roles (`login-page`).
 */
@Component({
  selector: 'ui-login-page',
  imports: [FormsModule, Icon, AuthLayout],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly selectedRole = signal<'admin' | 'cajero'>('admin');
  readonly username = signal('admin1');
  readonly password = signal('demo123');

  selectRole(role: 'admin' | 'cajero'): void {
    this.selectedRole.set(role);
    this.username.set(role === 'admin' ? 'admin1' : 'cajero1');
  }

  onLogin(): void {
    const role = this.selectedRole();
    const user = this.username().trim() || (role === 'admin' ? 'admin1' : 'cajero1');
    this.store.login(user, role);
    this.router.navigate([role === 'admin' ? '/dashboard' : '/pos']);
  }
}
