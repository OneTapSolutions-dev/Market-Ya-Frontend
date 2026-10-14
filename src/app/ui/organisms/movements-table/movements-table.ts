import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UnifiedMovement } from '../../../core/models/sale.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';
import { SearchBar } from '../../molecules/search-bar';

/**
 * Organismo: Tabla unificada de movimientos comerciales (Compras y Ventas) (`ui-movements-table`).
 */
@Component({
  selector: 'ui-movements-table',
  imports: [DatePipe, DecimalPipe, FormsModule, Button, Icon, Modal, SearchBar],
  templateUrl: './movements-table.html',
})
export class MovementsTable {
  readonly movements = input.required<UnifiedMovement[]>();
  readonly totalSalesToday = input<number>(0);
  readonly totalPurchasesMonth = input<number>(0);
  readonly salesCount = input<number>(0);
  readonly purchasesCount = input<number>(0);
  readonly pageSize = input<number>(10);

  readonly exportSalesRequested = output<void>();
  readonly exportPurchasesRequested = output<void>();
  readonly registerPurchaseRequested = output<void>();

  readonly searchQuery = signal('');
  readonly selectedType = signal<string>(''); // '' | 'VENTA' | 'COMPRA'
  readonly currentPage = signal(1);

  readonly detailModalOpen = signal(false);
  readonly selectedMovement = signal<UnifiedMovement | null>(null);

  readonly filteredMovements = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const type = this.selectedType();

    return this.movements().filter((m) => {
      if (type && m.type !== type) return false;
      if (!query) return true;

      return (
        m.documentRef.toLowerCase().includes(query) ||
        m.partyName.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query)
      );
    });
  });

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredMovements().length / this.pageSize()));
  });

  readonly paginatedMovements = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredMovements().slice(start, start + this.pageSize());
  });

  onSearch(term: string): void {
    this.searchQuery.set(term);
    this.currentPage.set(1);
  }

  onTypeChange(newType: string): void {
    this.selectedType.set(newType);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openDetail(move: UnifiedMovement): void {
    this.selectedMovement.set(move);
    this.detailModalOpen.set(true);
  }
}
