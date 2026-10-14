import { Component, computed, input } from '@angular/core';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'accent' | 'neutral';

/**
 * Átomo: Indicador de carga (`ui-spinner`).
 * - Mapea a clases daisyUI (`loading`, `loading-spinner`).
 */
@Component({
  selector: 'ui-spinner',
  template: `<span [class]="spinnerClass()" role="status" [attr.aria-label]="ariaLabel()"></span>`,
})
export class Spinner {
  readonly size = input<SpinnerSize>('md');
  readonly variant = input<SpinnerVariant>('primary');
  readonly ariaLabel = input('Cargando...');
  readonly customClass = input('', { alias: 'class' });

  readonly spinnerClass = computed(() => {
    const sizes: Record<SpinnerSize, string> = {
      xs: 'loading-xs',
      sm: 'loading-sm',
      md: 'loading-md',
      lg: 'loading-lg',
    };
    const variants: Record<SpinnerVariant, string> = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      neutral: 'text-neutral',
    };

    return ['loading loading-spinner', sizes[this.size()], variants[this.variant()], this.customClass()]
      .filter(Boolean)
      .join(' ');
  });
}
