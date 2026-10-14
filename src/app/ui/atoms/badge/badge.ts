import { Component, computed, input } from '@angular/core';

export type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'ghost';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Átomo: Badge (`ui-badge`).
 * - Mapea a clases daisyUI (`badge`, `badge-primary`, `badge-outline`, etc.).
 */
@Component({
  selector: 'ui-badge',
  templateUrl: './badge.html',
})
export class Badge {
  readonly label = input<string>();
  readonly variant = input<BadgeVariant>('neutral');
  readonly size = input<BadgeSize>('md');
  readonly outline = input(false);
  readonly customClass = input('', { alias: 'class' });

  readonly badgeClass = computed(() => {
    const variants: Record<BadgeVariant, string> = {
      primary: 'badge-primary text-white',
      secondary: 'badge-secondary text-white',
      accent: 'badge-accent text-amber-950',
      neutral: 'badge-neutral text-white',
      info: 'badge-info text-white',
      success: 'badge-success text-white',
      warning: 'badge-warning text-amber-950',
      error: 'badge-error text-white',
      ghost: 'badge-ghost',
    };
    const sizes: Record<BadgeSize, string> = {
      xs: 'badge-xs text-[9px]',
      sm: 'badge-sm text-[10px]',
      md: 'text-xs',
      lg: 'badge-lg text-sm',
    };

    return [
      'badge font-extrabold',
      variants[this.variant()],
      sizes[this.size()],
      this.outline() ? 'badge-outline' : '',
      this.customClass(),
    ].filter(Boolean).join(' ');
  });
}
