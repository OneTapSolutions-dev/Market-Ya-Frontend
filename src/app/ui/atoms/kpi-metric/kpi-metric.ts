import { Component, computed, input } from '@angular/core';

import { Icon, type IconName } from '../icon';

export type KpiColor = 'orange' | 'teal' | 'amber' | 'rose' | 'sky' | 'emerald';

/**
 * Átomo: Métrica KPI (`ui-kpi-metric`).
 * - Muestra un indicador numérico clave con color semántico, etiqueta y subtexto.
 */
@Component({
  selector: 'ui-kpi-metric',
  imports: [Icon],
  templateUrl: './kpi-metric.html',
})
export class KpiMetric {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly subtext = input<string>();
  readonly color = input<KpiColor>('orange');
  readonly icon = input<IconName>();
  readonly customClass = input('', { alias: 'class' });

  readonly borderClass = computed(() => {
    const borders: Record<KpiColor, string> = {
      orange: 'border-l-primary',
      teal: 'border-l-secondary',
      amber: 'border-l-amber-500',
      rose: 'border-l-rose-500',
      sky: 'border-l-sky-600',
      emerald: 'border-l-emerald-600',
    };
    return borders[this.color()];
  });
}
