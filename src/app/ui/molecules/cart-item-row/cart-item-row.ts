import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Icon } from '../../atoms/icon';

/**
 * Molécula: Fila de ítem en el carrito POS (`ui-cart-item-row`).
 * - Muestra nombre, SKU, desglose por nivel de empaque, controles de cantidad y eliminación.
 */
@Component({
  selector: 'ui-cart-item-row',
  imports: [DecimalPipe, Icon],
  templateUrl: './cart-item-row.html',
})
export class CartItemRow {
  readonly displayName = input.required<string>();
  readonly sku = input.required<string>();
  readonly unitPrice = input.required<number>();
  readonly quantity = input.required<number>();
  readonly subtotal = input.required<number>();
  readonly tier = input<'UNIDAD' | 'PACK' | 'CAJA'>('UNIDAD');
  readonly unitsPerItem = input(1);
  readonly customClass = input('', { alias: 'class' });

  readonly quantityChanged = output<number>();
  readonly removed = output<void>();

  decrease(): void {
    this.quantityChanged.emit(-1);
  }

  increase(): void {
    this.quantityChanged.emit(1);
  }
}
