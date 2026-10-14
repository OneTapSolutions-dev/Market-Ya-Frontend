import { Component, inject, signal } from '@angular/core';
import * as XLSX from 'xlsx';

import { PurchaseRecord } from '../../core/models/sale.model';
import { Store } from '../../core/services/store';
import { ToastStore } from '../../core/services/toast-store';
import { MovementsTable } from '../../ui/organisms/movements-table';
import { PurchaseRegisterModal } from '../../ui/organisms/purchase-register-modal';

/**
 * Página: Historial de Operaciones Comerciales y Compras (`movements-page`).
 */
@Component({
  selector: 'ui-movements-page',
  imports: [MovementsTable, PurchaseRegisterModal],
  templateUrl: './movements-page.html',
})
export class MovementsPage {
  readonly store = inject(Store);
  private readonly toastStore = inject(ToastStore);

  readonly purchaseModalOpen = signal(false);

  onPurchaseRegistered(record: PurchaseRecord): void {
    this.store.addPurchaseRecord(record);
  }

  onExportSales(): void {
    const sales = this.store.salesHistory();
    if (sales.length === 0) {
      this.toastStore.info('Sin Ventas', 'No hay comprobantes de venta registrados.');
      return;
    }

    const rows = sales.map((s) => ({
      Comprobante: s.receiptNumber,
      Tipo: s.documentType,
      Fecha: s.dateTime,
      Cliente: s.customer.name,
      Documento: `${s.customer.docType} ${s.customer.docNumber}`,
      MedioPago: s.paymentMethod,
      Total: s.total,
      Cajero: s.cashierName,
      EstadoSUNAT: s.sunatStatus,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas POS');
    XLSX.writeFile(wb, `ventas_pos_${new Date().toISOString().split('T')[0]}.xlsx`);
    this.toastStore.success('Excel Generado', 'Se descargó el reporte de ventas POS.');
  }

  onExportPurchases(): void {
    const purchases = this.store.purchasesHistory();
    if (purchases.length === 0) {
      this.toastStore.info('Sin Compras', 'No hay compras a proveedores registradas.');
      return;
    }

    const rows = purchases.map((p) => ({
      Factura: p.invoiceNumber,
      Proveedor: p.supplierName,
      FechaIngreso: p.dateTime,
      CondicionPago: p.paymentType,
      TotalCosto: p.totalCost,
      CantItems: p.items.length,
      Responsable: p.receivedBy,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Compras Proveedor');
    XLSX.writeFile(wb, `compras_proveedor_${new Date().toISOString().split('T')[0]}.xlsx`);
    this.toastStore.success('Excel Generado', 'Se descargó el reporte de compras a proveedores.');
  }
}
