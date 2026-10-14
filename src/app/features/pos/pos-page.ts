import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { Product } from '../../core/models/product.model';
import { CustomerInfo, DocumentType, PaymentMethod, SaleTransaction } from '../../core/models/sale.model';
import { Store } from '../../core/services/store';
import { Icon } from '../../ui/atoms/icon';
import { CheckoutModal } from '../../ui/organisms/checkout-modal';
import { PosCart } from '../../ui/organisms/pos-cart';
import { PosCatalog } from '../../ui/organisms/pos-catalog';
import { ProductDetailModal } from '../../ui/organisms/product-detail-modal';

/**
 * Página: Punto de Venta (POS) Táctil y Facturación Rápida (`pos-page`).
 */
@Component({
  selector: 'ui-pos-page',
  imports: [DecimalPipe, Icon, PosCatalog, PosCart, CheckoutModal, ProductDetailModal],
  templateUrl: './pos-page.html',
})
export class PosPage {
  readonly store = inject(Store);

  readonly selectedProductForDetail = signal<Product | null>(null);
  readonly checkoutModalOpen = signal(false);
  readonly lastTransaction = signal<SaleTransaction | null>(null);
  readonly activeMobileTab = signal<'catalog' | 'cart'>('catalog');

  readonly cartTotal = computed(() => {
    return this.store.cart().reduce((sum, item) => sum + item.subtotal, 0);
  });

  onAddToCart(event: {
    product: Product;
    quantity?: number;
    customUnitPrice?: number;
    displayName?: string;
    tier?: 'UNIDAD' | 'PACK' | 'CAJA';
    unitsPerItem?: number;
  }): void {
    this.store.addToCart(
      event.product,
      event.quantity ?? 1,
      event.customUnitPrice,
      event.displayName,
      event.tier ?? 'UNIDAD',
      event.unitsPerItem ?? 1,
    );
  }

  onQuantityChange(event: { productId: string; delta: number; tier?: 'UNIDAD' | 'PACK' | 'CAJA' }): void {
    this.store.updateCartQuantity(event.productId, event.delta, event.tier);
  }

  onRemoveItem(event: { productId: string; tier?: 'UNIDAD' | 'PACK' | 'CAJA' }): void {
    this.store.removeFromCart(event.productId, event.tier);
  }

  onClearCart(): void {
    this.store.clearCart();
  }

  openCheckout(): void {
    if (this.store.cart().length > 0) {
      this.checkoutModalOpen.set(true);
    }
  }

  onSaleCompleted(data: {
    documentType: DocumentType;
    customer: CustomerInfo;
    paymentMethod: PaymentMethod;
    amountPaid: number;
  }): void {
    const tx = this.store.processSale(
      data.documentType,
      data.customer,
      data.paymentMethod,
      data.amountPaid,
    );
    this.lastTransaction.set(tx);
    this.checkoutModalOpen.set(false);
  }

  openProductDetail(product: Product): void {
    this.selectedProductForDetail.set(product);
  }
}
