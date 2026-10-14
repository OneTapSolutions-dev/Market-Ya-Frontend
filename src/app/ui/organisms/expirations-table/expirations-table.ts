import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../core/models/product.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';
import { SearchBar } from '../../molecules/search-bar';

/**
 * Organismo: Tabla de monitoreo de vencimientos y asignación de ofertas (`ui-expirations-table`).
 */
@Component({
  selector: 'ui-expirations-table',
  imports: [DecimalPipe, FormsModule, Button, Icon, Modal, SearchBar],
  templateUrl: './expirations-table.html',
})
export class ExpirationsTable {
  readonly products = input.required<Product[]>();
  readonly pageSize = input<number>(10);

  readonly discountAssigned = output<{ product: Product; newPrice: number }>();

  readonly searchQuery = signal('');
  readonly currentPage = signal(1);

  readonly discountModalOpen = signal(false);
  readonly selectedProduct = signal<Product | null>(null);
  readonly customPrice = signal<number>(0);

  readonly nearExpiringProducts = computed(() => {
    const today = new Date();
    const query = this.searchQuery().trim().toLowerCase();

    return this.products().filter((p) => {
      const exp = new Date(p.expirationDate);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
      const isCritical = diffDays <= 30;

      if (!isCritical) return false;
      if (!query) return true;

      return (
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.barcode.toLowerCase().includes(query) ||
        p.supplier.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    });
  });

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.nearExpiringProducts().length / this.pageSize()));
  });

  readonly paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.nearExpiringProducts().slice(start, start + this.pageSize());
  });

  getDaysLeft(expirationDate: string): number {
    const today = new Date();
    const exp = new Date(expirationDate);
    return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  onSearch(term: string): void {
    this.searchQuery.set(term);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openDiscountModal(prod: Product): void {
    this.selectedProduct.set(prod);
    // Sugerir 20% de descuento
    const discounted = Number((prod.salePrice * 0.8).toFixed(2));
    this.customPrice.set(discounted);
    this.discountModalOpen.set(true);
  }

  saveDiscount(): void {
    const prod = this.selectedProduct();
    if (prod && this.customPrice() > 0) {
      this.discountAssigned.emit({ product: prod, newPrice: this.customPrice() });
      this.discountModalOpen.set(false);
    }
  }
}
