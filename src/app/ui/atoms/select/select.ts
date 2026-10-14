import { Component, computed, input, model } from '@angular/core';

export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * Átomo: Selector desplegable (`ui-select`).
 * - Mapea a clases daisyUI (`select`, `select-bordered`, etc.).
 */
@Component({
  selector: 'ui-select',
  templateUrl: './select.html',
})
export class Select {
  readonly value = model<string>('');
  readonly disabled = input(false);
  readonly error = input(false);
  readonly size = input<SelectSize>('md');
  readonly id = input<string>();
  readonly name = input<string>();
  readonly ariaLabel = input<string>();
  readonly customClass = input('', { alias: 'class' });

  readonly selectClass = computed(() => {
    const sizes: Record<SelectSize, string> = {
      sm: 'select-sm text-xs',
      md: 'text-sm',
      lg: 'select-lg text-base',
    };

    return [
      'select select-bordered w-full rounded-xl bg-white border-slate-300 text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
      sizes[this.size()],
      this.error() ? 'select-error border-rose-500' : '',
      this.disabled() ? 'opacity-60 cursor-not-allowed bg-slate-100' : '',
      this.customClass(),
    ].filter(Boolean).join(' ');
  });

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value.set(target.value);
  }
}
