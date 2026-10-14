import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { CartItem } from '../../../core/models/product.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { CartItemRow } from '../../molecules/cart-item-row';

/**
 * Organismo: Panel lateral del carrito de ventas POS (`ui-pos-cart`).
 * - Lista reactiva de productos seleccionados, subtotales, cálculo de IGV y botón de cobro.
 */
@Component({
  selector: 'ui-pos-cart',
  imports: [DecimalPipe, Button, Icon, CartItemRow],
  templateUrl: './pos-cart.html',
})
export class PosCart {
  readonly items = input.required<CartItem[]>();
  readonly customClass = input('', { alias: 'class' });

  readonly quantityChanged = output<{ productId: string; delta: number; tier?: 'UNIDAD' | 'PACK' | 'CAJA' }>();
  readonly itemRemoved = output<{ productId: string; tier?: 'UNIDAD' | 'PACK' | 'CAJA' }>();
  readonly cartCleared = output<void>();
  readonly checkoutRequested = output<void>();

  readonly total = computed(() => {
    return this.items().reduce((sum, item) => sum + item.subtotal, 0);
  });

  readonly subtotal = computed(() => {
    return this.total() / 1.18;
  });

  readonly igv = computed(() => {
    return this.total() - this.subtotal();
  });
}
