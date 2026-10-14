import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Store } from '../../core/services/store';
import { Icon } from '../../ui/atoms/icon';
import { ReportsGenerator } from '../../ui/organisms/reports-generator';
import { SalesAnalytics } from '../../ui/organisms/sales-analytics';

/**
 * Página: Dashboard Directivo y Analítica (`dashboard-page`).
 */
@Component({
  selector: 'ui-dashboard-page',
  imports: [RouterLink, Icon, ReportsGenerator, SalesAnalytics],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  readonly store = inject(Store);

  readonly activeDashboardView = signal<'overview' | 'reports'>('overview');

  get todayDate(): string {
    return new Date().toLocaleString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
