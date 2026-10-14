import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

import { DocumentType, PaymentMethod, SaleTransaction } from '../../../core/models/sale.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';

export interface ReportFilterState {
  dateFrom: string;
  dateTo: string;
  paymentMethod: 'TODOS' | PaymentMethod;
  documentType: 'TODOS' | DocumentType;
  sunatStatus: 'TODOS' | 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
  category: string;
}

/**
 * Organismo: Generador de reportes comerciales y exportación Excel (`ui-reports-generator`).
 */
@Component({
  selector: 'ui-reports-generator',
  imports: [DecimalPipe, FormsModule, Button, Icon],
  templateUrl: './reports-generator.html',
})
export class ReportsGenerator {
  readonly sales = input.required<SaleTransaction[]>();
  readonly categories = input.required<string[]>();

  readonly exportRequested = output<SaleTransaction[]>();

  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly paymentMethod = signal<'TODOS' | PaymentMethod>('TODOS');
  readonly documentType = signal<'TODOS' | DocumentType>('TODOS');
  readonly sunatStatus = signal<'TODOS' | 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO'>('TODOS');
  readonly category = signal('TODAS');

  readonly applied = signal(false);
  readonly reportSales = signal<SaleTransaction[]>([]);

  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  readonly reportTotal = computed(() => {
    return this.reportSales().reduce((sum, s) => sum + s.total, 0);
  });

  readonly averageTicket = computed(() => {
    const list = this.reportSales();
    return list.length ? this.reportTotal() / list.length : 0;
  });

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.reportSales().length / this.pageSize()));
  });

  readonly paginatedSales = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.reportSales().slice(start, start + this.pageSize());
  });

  generateReport(): void {
    const from = this.dateFrom();
    const to = this.dateTo();
    const pm = this.paymentMethod();
    const dt = this.documentType();
    const ss = this.sunatStatus();
    const cat = this.category();

    const filtered = this.sales().filter((s) => {
      if (pm !== 'TODOS' && s.paymentMethod !== pm) return false;
      if (dt !== 'TODOS' && s.documentType !== dt) return false;
      if (ss !== 'TODOS' && s.sunatStatus !== ss) return false;

      const dateOnly = s.dateTime.split('T')[0];
      if (from && dateOnly < from) return false;
      if (to && dateOnly > to) return false;

      if (cat !== 'TODAS') {
        const hasCategory = s.items.some((i) => i.product.category === cat);
        if (!hasCategory) return false;
      }

      return true;
    });

    this.reportSales.set(filtered);
    this.applied.set(true);
    this.currentPage.set(1);
  }

  resetFilters(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.paymentMethod.set('TODOS');
    this.documentType.set('TODOS');
    this.sunatStatus.set('TODOS');
    this.category.set('TODAS');
    this.applied.set(false);
    this.reportSales.set([]);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  exportExcel(): void {
    const list = this.reportSales();
    if (list.length === 0) return;

    const rows = list.map((s) => ({
      Comprobante: s.receiptNumber,
      Tipo: s.documentType,
      Fecha: s.dateTime,
      Cliente: s.customer.name,
      Documento: `${s.customer.docType} ${s.customer.docNumber}`,
      MedioPago: s.paymentMethod,
      Subtotal: s.subtotal,
      IGV: s.igv,
      Total: s.total,
      Cajero: s.cashierName,
      EstadoSUNAT: s.sunatStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Ventas');
    XLSX.writeFile(workbook, `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`);

    this.exportRequested.emit(list);
  }
}
