import { Component, computed, input, output } from '@angular/core';

import { Icon, type IconName } from '../../atoms/icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Molécula: Alerta (`ui-alert`).
 * - Mapea a clases daisyUI (`alert`, `alert-info`, `alert-success`, etc.).
 */
@Component({
  selector: 'ui-alert',
  imports: [Icon],
  templateUrl: './alert.html',
})
export class Alert {
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string>();
  readonly dismissible = input(false);
  readonly customClass = input('', { alias: 'class' });

  readonly dismissed = output<void>();

  readonly alertClass = computed(() => {
    const variants: Record<AlertVariant, string> = {
      info: 'alert-info text-white',
      success: 'alert-success text-white',
      warning: 'alert-warning text-amber-950',
      error: 'alert-error text-white',
    };
    return ['alert rounded-2xl shadow-sm text-xs sm:text-sm', variants[this.variant()], this.customClass()]
      .filter(Boolean)
      .join(' ');
  });

  readonly icon = computed<IconName>(() => {
    const icons: Record<AlertVariant, IconName> = {
      info: 'informationCircle',
      success: 'checkCircle',
      warning: 'exclamationTriangle',
      error: 'xCircle',
    };
    return icons[this.variant()];
  });
}
