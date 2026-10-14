import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { Icon } from '../../atoms/icon';

/**
 * Molécula: Tarjeta de producto en catálogo POS (`ui-product-pos-card`).
 * - Muestra SKU, stock en góndola con alerta semántica, nombre, precio, promo y acción rápida de agregar.
 */
@Component({
  selector: 'ui-product-pos-card',
  imports: [DecimalPipe, Icon],
  templateUrl: './product-pos-card.html',
})
export class ProductPosCard {
  readonly name = input.required<string>();
  readonly sku = input.required<string>();
  readonly salePrice = input.required<number>();
  readonly stockGondola = input.required<number>();
  readonly minGondola = input.required<number>();
  readonly isPromo = input(false);
  readonly customClass = input('', { alias: 'class' });

  readonly cardClicked = output<void>();
  readonly detailClicked = output<void>();

  readonly isLowStock = computed(() => this.stockGondola() <= this.minGondola());
  readonly isOutOfStock = computed(() => this.stockGondola() <= 0);

  onDetail(event: MouseEvent): void {
    event.stopPropagation();
    this.detailClicked.emit();
  }
}
