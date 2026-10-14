import { Component, inject, model, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AppNotification, Store } from '../../../core/services/store';
import { Avatar } from '../../atoms/avatar';
import { Icon } from '../../atoms/icon';
import { NotificationItem } from '../../molecules/notification-item';

/**
 * Organismo: Barra de navegación superior fija (`ui-header`).
 * - Logo corporativo, selector de sede, navegación principal con routerLink, notificaciones y perfil.
 */
@Component({
  selector: 'ui-header',
  imports: [RouterLink, RouterLinkActive, Avatar, Icon, NotificationItem],
  templateUrl: './header.html',
})
export class Header {
  readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly isMobileMenuOpen = model(false);
  readonly isNotificationsOpen = signal(false);

  toggleNotifications(): void {
    this.isNotificationsOpen.update((v) => !v);
  }

  handleNotificationClick(notif: AppNotification): void {
    this.store.markNotificationAsRead(notif.id);
    this.isNotificationsOpen.set(false);
    this.router.navigateByUrl(notif.linkRoute);
  }

  logout(): void {
    this.store.logout();
    this.router.navigateByUrl('/login');
  }

  onLogoError(event: Event): void {
    (event.target as HTMLElement).style.display = 'none';
  }
}
