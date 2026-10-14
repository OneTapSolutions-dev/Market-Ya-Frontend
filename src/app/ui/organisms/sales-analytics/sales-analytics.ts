import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  BUSINESS_CLOSE_HOUR,
  BUSINESS_OPEN_HOUR,
  SalesAnalytics as SalesAnalyticsService,
  SalesDashboardFilters,
} from '../../../core/services/sales-analytics';
import { Store } from '../../../core/services/store';
import { Input } from '../../atoms/input';
import { KpiMetric } from '../../atoms/kpi-metric';
import { DualRangeSlider } from '../../molecules/dual-range-slider';

/**
 * Organismo: Panel analítico de ventas (`ui-sales-analytics`).
 * - Filtros por fechas y horas, métricas KPI y gráficos SVG horarios y semanales.
 */
@Component({
  selector: 'ui-sales-analytics',
  imports: [DecimalPipe, Input, KpiMetric, DualRangeSlider],
  templateUrl: './sales-analytics.html',
})
export class SalesAnalytics {
  private readonly store = inject(Store);
  private readonly analyticsService = inject(SalesAnalyticsService);

  readonly openHour = BUSINESS_OPEN_HOUR;
  readonly closeHour = BUSINESS_CLOSE_HOUR;

  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly hourFrom = signal(BUSINESS_OPEN_HOUR);
  readonly hourTo = signal(BUSINESS_CLOSE_HOUR);
  readonly weekday = signal('TODOS');

  readonly filters = computed<SalesDashboardFilters>(() => ({
    dateFrom: this.dateFrom(),
    dateTo: this.dateTo(),
    hourFrom: this.hourFrom(),
    hourTo: this.hourTo(),
    weekday: this.weekday(),
    week: '',
    month: '',
    year: '',
  }));

  readonly filteredSales = computed(() => {
    return this.analyticsService.filterSales(this.store.salesHistory(), this.filters());
  });

  readonly summary = computed(() => {
    return this.analyticsService.summarize(this.filteredSales());
  });

  readonly hourlySales = computed(() => {
    return this.analyticsService.salesByHour(this.filteredSales(), this.hourFrom(), this.hourTo());
  });

  readonly weekdaySales = computed(() => {
    return this.analyticsService.salesByWeekday(this.filteredSales());
  });

  readonly maxHourlyTotal = computed(() => {
    return Math.max(1, ...this.hourlySales().map((b) => b.total));
  });

  readonly maxWeekdayTotal = computed(() => {
    return Math.max(1, ...this.weekdaySales().map((b) => b.total));
  });

  readonly hourlyLinePoints = computed(() => {
    const buckets = this.hourlySales();
    if (buckets.length === 0) return '';
    return buckets.map((b, i) => `${this.hourChartX(i)},${this.hourChartY(b.total)}`).join(' ');
  });

  hourChartX(index: number): number {
    const count = this.hourlySales().length;
    if (count <= 1) return 270;
    const startX = 35;
    const endX = 515;
    return startX + (index / (count - 1)) * (endX - startX);
  }

  hourChartY(total: number): number {
    const bottom = 145;
    const top = 35;
    const ratio = total / this.maxHourlyTotal();
    return bottom - ratio * (bottom - top);
  }

  resetFilters(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.hourFrom.set(BUSINESS_OPEN_HOUR);
    this.hourTo.set(BUSINESS_CLOSE_HOUR);
    this.weekday.set('TODOS');
  }
}
