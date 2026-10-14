import { Component, inject } from '@angular/core';
import * as XLSX from 'xlsx';

import { Product } from '../../core/models/product.model';
import { Store, SupplierPolicy } from '../../core/services/store';
import { ToastStore } from '../../core/services/toast-store';
import { ExpirationsTable } from '../../ui/organisms/expirations-table';
import { SupplierPoliciesList } from '../../ui/organisms/supplier-policies-list';

/**
 * Página: Control de Vencimientos, Ofertas y Políticas de Canje (`expirations-page`).
 */
@Component({
  selector: 'ui-expirations-page',
  imports: [ExpirationsTable, SupplierPoliciesList],
  templateUrl: './expirations-page.html',
})
export class ExpirationsPage {
  readonly store = inject(Store);
  private readonly toastStore = inject(ToastStore);

  onPolicyAdded(policy: SupplierPolicy): void {
    this.store.addSupplierPolicy(policy);
  }

  onDiscountAssigned(event: { product: Product; newPrice: number }): void {
    const success = this.store.updateProductPrice(event.product.id, event.newPrice);
    if (success) {
      this.toastStore.success(
        'Oferta Asignada',
        `"${event.product.name}" ahora tiene un precio promocional de S/ ${event.newPrice.toFixed(2)}.`,
      );
    }
  }

  onExportCanjes(): void {
    const today = new Date();
    const critical = this.store.products().filter((p) => {
      const exp = new Date(p.expirationDate);
      const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return diff <= 30;
    });

    if (critical.length === 0) {
      this.toastStore.info('Sin Ítems Críticos', 'No hay productos que requieran canje en este momento.');
      return;
    }

    const rows = critical.map((p) => ({
      Producto: p.name,
      SKU: p.sku,
      Proveedor: p.supplier,
      ReglaCanje: `${p.exchangeDaysLimit} días antes`,
      FechaIngresoFactura: p.supplierInvoiceDate,
      FechaExpiracion: p.expirationDate,
      StockGondola: p.stockGondola,
      PrecioVenta: p.salePrice,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Canjes');
    XLSX.writeFile(wb, `reporte_canjes_${new Date().toISOString().split('T')[0]}.xlsx`);
    this.toastStore.success('Reporte Exportado', 'Se descargó el reporte de canjes a proveedores.');
  }
}
