import { Component, inject } from '@angular/core';

import { SaleTransaction } from '../../core/models/sale.model';
import { Store } from '../../core/services/store';
import { ToastStore } from '../../core/services/toast-store';
import { ReportsGenerator } from '../../ui/organisms/reports-generator';

/**
 * Página: Generador de Reportes de Ventas y Facturación (`reports-page`).
 */
@Component({
  selector: 'ui-reports-page',
  imports: [ReportsGenerator],
  templateUrl: './reports-page.html',
})
export class ReportsPage {
  readonly store = inject(Store);
  private readonly toastStore = inject(ToastStore);

  onExportRequested(sales: SaleTransaction[]): void {
    this.toastStore.success('Excel Generado', `Se exportaron ${sales.length} registros de venta exitosamente.`);
  }
}
