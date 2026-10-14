import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { Icon, type IconName } from '../../atoms/icon';

export type NotificationType = 'transfer' | 'expiration' | 'system';

/**
 * Molécula: Ítem de notificación en dropdown (`ui-notification-item`).
 * - Muestra icono coloreado según tipo, título, detalle y estado de lectura.
 */
@Component({
  selector: 'ui-notification-item',
  imports: [DatePipe, Icon],
  templateUrl: './notification-item.html',
})
export class NotificationItem {
  readonly type = input<NotificationType>('system');
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly timestamp = input.required<string>();
  readonly read = input(false);
  readonly customClass = input('', { alias: 'class' });

  readonly itemClicked = output<void>();

  readonly iconName = computed<IconName>(() => {
    switch (this.type()) {
      case 'transfer':
        return 'arrowsRightLeft';
      case 'expiration':
        return 'clock';
      default:
        return 'informationCircle';
    }
  });

  readonly iconContainerClass = computed(() => {
    switch (this.type()) {
      case 'transfer':
        return 'bg-blue-100 text-blue-600';
      case 'expiration':
        return 'bg-rose-100 text-rose-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  });
}
