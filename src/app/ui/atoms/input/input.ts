import { Component, computed, input, model, output } from '@angular/core';

export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Átomo: Campo de entrada (`ui-input`).
 * - Mapea a clases daisyUI (`input`, `input-bordered`, `input-error`, etc.).
 * - Usa `model()` para enlace bidireccional reactivo.
 */
@Component({
  selector: 'ui-input',
  templateUrl: './input.html',
})
export class Input {
  readonly value = model<string | number>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly size = input<InputSize>('md');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input(false);
  readonly id = input<string>();
  readonly name = input<string>();
  readonly ariaLabel = input<string>();
  readonly customClass = input('', { alias: 'class' });

  readonly enterPressed = output<void>();
  readonly inputChange = output<string>();

  readonly inputClass = computed(() => {
    const sizes: Record<InputSize, string> = {
      sm: 'input-sm text-xs',
      md: 'text-sm',
      lg: 'input-lg text-base',
    };

    return [
      'input input-bordered w-full rounded-xl bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
      sizes[this.size()],
      this.error() ? 'input-error border-rose-500' : '',
      this.disabled() ? 'opacity-60 cursor-not-allowed bg-slate-100' : '',
      this.customClass(),
    ].filter(Boolean).join(' ');
  });

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.inputChange.emit(target.value);
  }
}
