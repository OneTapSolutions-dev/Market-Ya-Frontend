import { Component, computed, input, output } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'ghost'
  | 'danger'
  | 'warning'
  | 'error'
  | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Átomo: Botón (`ui-button`).
 * - Mapea a clases semánticas daisyUI (`btn`, `btn-primary`, etc.).
 * - Accesible con `ariaLabel`, estado `aria-busy` y soporte de teclado nativo.
 */
@Component({
  selector: 'ui-button',
  templateUrl: './button.html',
})
export class Button {
  readonly label = input<string>();
  readonly ariaLabel = input<string>();
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly block = input(false);
  readonly customClass = input('', { alias: 'class' });

  readonly clicked = output<void>();

  readonly buttonClass = computed(() => {
    const variants: Record<ButtonVariant, string> = {
      primary: 'btn-primary text-white shadow-sm shadow-orange-500/20',
      secondary: 'btn-secondary text-white shadow-sm shadow-teal-700/20',
      accent: 'btn-accent text-amber-950 shadow-sm',
      neutral: 'btn-neutral text-white shadow-sm',
      ghost: 'btn-ghost',
      danger: 'btn-error text-white shadow-sm shadow-rose-600/20',
      warning: 'btn-warning text-amber-950 shadow-sm shadow-amber-500/20',
      error: 'btn-error text-white shadow-sm shadow-rose-600/20',
      outline: 'btn-outline border-slate-300 text-slate-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700',
    };
    const sizes: Record<ButtonSize, string> = {
      xs: 'btn-xs text-xs',
      sm: 'btn-sm text-xs',
      md: 'text-sm',
      lg: 'btn-lg text-base',
    };

    return [
      'btn',
      variants[this.variant()],
      sizes[this.size()],
      this.block() ? 'btn-block' : '',
      this.customClass(),
    ].filter(Boolean).join(' ');
  });
}
