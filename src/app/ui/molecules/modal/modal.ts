import { Component, computed, input, model, output } from '@angular/core';

import { Icon } from '../../atoms/icon';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Molécula: Diálogo modal accesible (`ui-modal`).
 * - Mapea a clases daisyUI (`modal`, `modal-box`, `modal-open`).
 * - Soporta tecla Escape y backdrop click.
 */
@Component({
  selector: 'ui-modal',
  imports: [Icon],
  templateUrl: './modal.html',
})
export class Modal {
  readonly open = model(false);
  readonly title = input<string>();
  readonly size = input<ModalSize>('md');
  readonly closeOnBackdrop = input(true);
  readonly customClass = input('', { alias: 'class' });

  readonly closed = output<void>();

  readonly boxClass = computed(() => {
    const sizes: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
      '2xl': 'max-w-4xl',
    };
    return [
      'modal-box bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xl relative',
      sizes[this.size()],
      this.customClass(),
    ].filter(Boolean).join(' ');
  });

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }
}
