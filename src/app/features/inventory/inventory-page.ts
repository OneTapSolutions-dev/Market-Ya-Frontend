import { Component, computed, inject, signal } from '@angular/core';

import { Product } from '../../core/models/product.model';
import { Store } from '../../core/services/store';
import { Button } from '../../ui/atoms/button';
import { Icon } from '../../ui/atoms/icon';
import { KardexTable } from '../../ui/organisms/kardex-table';
import { ProductDetailModal } from '../../ui/organisms/product-detail-modal';
import { ProductFormModal } from '../../ui/organisms/product-form-modal';
import { StockTransferModal } from '../../ui/organisms/stock-transfer-modal';

/**
 * Página: Gestión de Inventario, Doble Kardex y Traslados (`inventory-page`).
 */
@Component({
  selector: 'ui-inventory-page',
  imports: [
    Button,
    Icon,
    KardexTable,
    ProductDetailModal,
    ProductFormModal,
    StockTransferModal,
  ],
  templateUrl: './inventory-page.html',
})
export class InventoryPage {
  readonly store = inject(Store);

  readonly activeSubTab = signal<'STOCK' | 'TRASLADOS'>('STOCK');

  // Modales
  readonly transferModalOpen = signal(false);
  readonly selectedProductForTransfer = signal<Product | null>(null);

  readonly detailModalOpen = signal(false);
  readonly selectedProductForDetail = signal<Product | null>(null);

  readonly productFormModalOpen = signal(false);

  readonly lowStockItems = computed(() => {
    return this.store.products().filter((p) => p.stockGondola <= p.minGondola);
  });

  openTransferModal(product: Product): void {
    this.selectedProductForTransfer.set(product);
    this.transferModalOpen.set(true);
  }

  onTransferConfirm(event: { productId: string; quantity: number; notes: string }): void {
    this.store.transferStock(event.productId, event.quantity, event.notes);
    this.transferModalOpen.set(false);
  }

  openProductDetail(product: Product): void {
    this.selectedProductForDetail.set(product);
    this.detailModalOpen.set(true);
  }

  openAddProductModal(): void {
    this.productFormModalOpen.set(true);
  }

  onProductCreated(product: Product): void {
    this.store.addProduct(product);
    this.productFormModalOpen.set(false);
  }
}
