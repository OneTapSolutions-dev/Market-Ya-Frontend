import { DecimalPipe } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';

import { Product } from '../../../core/models/product.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Modal de detalle del producto (`ui-product-detail-modal`).
 * - Muestra desglose de precios por nivel (Unidad / Pack / Caja), stock en almacén vs góndola y vencimiento.
 */
@Component({
  selector: 'ui-product-detail-modal',
  imports: [DecimalPipe, Button, Icon, Modal],
  templateUrl: './product-detail-modal.html',
})
export class ProductDetailModal {
  readonly open = model(false);
  readonly product = input<Product | null>(null);

  readonly addedToCart = output<{
    product: Product;
    quantity: number;
    tier: 'UNIDAD' | 'PACK' | 'CAJA';
    unitPrice: number;
    unitsPerItem: number;
  }>();

  readonly selectedTier = signal<'UNIDAD' | 'PACK' | 'CAJA'>('UNIDAD');
  readonly quantity = signal<number>(1);

  readonly packPrice = computed(() => {
    const prod = this.product();
    if (!prod) return 0;
    return prod.salePrice * 6 * 0.95; // 5% descuento en pack
  });

  readonly boxPrice = computed(() => {
    const prod = this.product();
    if (!prod) return 0;
    const units = prod.unitsPerBox || 24;
    return prod.salePrice * units * 0.9; // 10% descuento en caja
  });

  readonly activePrice = computed(() => {
    const prod = this.product();
    if (!prod) return 0;
    if (this.selectedTier() === 'PACK') return this.packPrice();
    if (this.selectedTier() === 'CAJA') return this.boxPrice();
    return prod.salePrice;
  });

  readonly unitsPerSelectedTier = computed(() => {
    if (this.selectedTier() === 'PACK') return 6;
    if (this.selectedTier() === 'CAJA') return this.product()?.unitsPerBox || 24;
    return 1;
  });

  decreaseQuantity(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  increaseQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  addToCart(): void {
    const prod = this.product();
    if (!prod) return;

    this.addedToCart.emit({
      product: prod,
      quantity: this.quantity(),
      tier: this.selectedTier(),
      unitPrice: this.activePrice(),
      unitsPerItem: this.unitsPerSelectedTier(),
    });
    this.open.set(false);
  }
}
