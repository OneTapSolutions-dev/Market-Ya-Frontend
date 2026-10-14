import { Service } from '@angular/core';

import { SaleTransaction } from '../models/sale.model';

export interface SalesDashboardFilters {
  dateFrom: string;
  dateTo: string;
  hourFrom: number;
  hourTo: number;
  weekday: string;
  week: string;
  month: string;
  year: string;
}

export interface SalesSummary {
  total: number;
  transactions: number;
  averageTicket: number;
  productsSold: number;
  peakHour: string;
  peakDay: string;
}

export interface SalesBucket {
  key: string;
  label: string;
  total: number;
  transactions: number;
  productsSold: number;
}

export const WEEKDAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const BUSINESS_OPEN_HOUR = 7;
export const BUSINESS_CLOSE_HOUR = 22;

@Service()
export class SalesAnalytics {
  filterSales(sales: SaleTransaction[], filters: SalesDashboardFilters): SaleTransaction[] {
    const dateFrom = filters.dateFrom
      ? new Date(`${filters.dateFrom}T00:00:00`).getTime()
      : Number.NEGATIVE_INFINITY;
    const dateTo = filters.dateTo
      ? new Date(`${filters.dateTo}T23:59:59.999`).getTime()
      : Number.POSITIVE_INFINITY;

    return sales.filter((sale) => {
      const date = new Date(sale.dateTime);
      const timestamp = date.getTime();
      const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
      const hourMatches = hour >= filters.hourFrom && hour <= filters.hourTo;
      const weekdayMatches = filters.weekday === 'TODOS' || String(date.getDay()) === filters.weekday;

      return timestamp >= dateFrom && timestamp <= dateTo && hourMatches && weekdayMatches;
    });
  }

  summarize(sales: SaleTransaction[]): SalesSummary {
    const total = sales.reduce((sum, sale) => sum + sale.total, 0);
    const productsSold = sales.reduce(
      (sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity * (item.unitsPerItem || 1), 0),
      0,
    );
    const hourlyBuckets = this.salesByHour(sales, BUSINESS_OPEN_HOUR, BUSINESS_CLOSE_HOUR);
    const weekdayBuckets = this.salesByWeekday(sales);
    const peakHour = hourlyBuckets.reduce<SalesBucket | null>(
      (peak, bucket) => (bucket.total > 0 && (!peak || bucket.total > peak.total) ? bucket : peak),
      null,
    );
    const peakDay = weekdayBuckets.reduce<SalesBucket | null>(
      (peak, bucket) => (bucket.total > 0 && (!peak || bucket.total > peak.total) ? bucket : peak),
      null,
    );

    return {
      total,
      transactions: sales.length,
      averageTicket: sales.length ? total / sales.length : 0,
      productsSold,
      peakHour: peakHour?.label ?? '—',
      peakDay: peakDay?.label ?? '—',
    };
  }

  salesByHour(sales: SaleTransaction[], fromHour: number, toHour: number): SalesBucket[] {
    const start = Math.max(0, Math.min(23, Math.floor(fromHour)));
    const end = Math.max(start, Math.min(23, Math.ceil(toHour)));
    const buckets: SalesBucket[] = [];

    for (let h = start; h <= end; h++) {
      const label = `${String(h).padStart(2, '0')}:00`;
      const hourSales = sales.filter((sale) => new Date(sale.dateTime).getHours() === h);
      buckets.push({
        key: String(h),
        label,
        total: hourSales.reduce((acc, s) => acc + s.total, 0),
        transactions: hourSales.length,
        productsSold: hourSales.reduce(
          (acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity * (i.unitsPerItem || 1), 0),
          0,
        ),
      });
    }

    return buckets;
  }

  salesByWeekday(sales: SaleTransaction[]): SalesBucket[] {
    return WEEKDAY_LABELS.map((label, dayIndex) => {
      const daySales = sales.filter((s) => new Date(s.dateTime).getDay() === dayIndex);
      return {
        key: String(dayIndex),
        label,
        total: daySales.reduce((acc, s) => acc + s.total, 0),
        transactions: daySales.length,
        productsSold: daySales.reduce(
          (acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity * (i.unitsPerItem || 1), 0),
          0,
        ),
      };
    });
  }
}
