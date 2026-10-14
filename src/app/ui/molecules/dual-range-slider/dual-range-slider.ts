import { Component, computed, input, model } from '@angular/core';

/**
 * Molécula: Selector de rango de horas con doble deslizador (`ui-dual-range-slider`).
 * - Usado en analítica de ventas para filtrar el horario de atención.
 */
@Component({
  selector: 'ui-dual-range-slider',
  templateUrl: './dual-range-slider.html',
})
export class DualRangeSlider {
  readonly from = model<number>(7);
  readonly to = model<number>(22);
  readonly min = input<number>(7);
  readonly max = input<number>(22);
  readonly step = input<number>(1);
  readonly customClass = input('', { alias: 'class' });

  readonly fromPosition = computed(() => this.hourPosition(this.from()));
  readonly toPosition = computed(() => this.hourPosition(this.to()));
  readonly rangeWidth = computed(() => this.toPosition() - this.fromPosition());

  formatHour(hour: number): string {
    const whole = Math.floor(hour);
    const mins = Math.round((hour - whole) * 60);
    return `${String(whole).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  hourPosition(hour: number): number {
    const range = this.max() - this.min();
    if (range <= 0) return 0;
    return Math.max(0, Math.min(100, ((hour - this.min()) / range) * 100));
  }

  onFromInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    const clamped = Math.min(val, this.to() - this.step());
    this.from.set(clamped);
  }

  onToInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    const clamped = Math.max(val, this.from() + this.step());
    this.to.set(clamped);
  }
}
