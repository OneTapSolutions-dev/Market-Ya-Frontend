import { Component, input, model, output, signal } from '@angular/core';

import { Product } from '../../../core/models/product.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Input } from '../../atoms/input';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Modal de traslado de inventario Almacén -> Góndola (`ui-stock-transfer-modal`).
 */
@Component({
  selector: 'ui-stock-transfer-modal',
  imports: [Button, Icon, Input, Modal],
  templateUrl: './stock-transfer-modal.html',
})
export class StockTransferModal {
  readonly open = model(false);
  readonly product = input<Product | null>(null);

  readonly transferConfirmed = output<{ productId: string; quantity: number; notes: string }>();

  readonly quantity = signal<number>(1);
  readonly notes = signal<string>('Reposición matutina de góndola');

  confirm(): void {
    const prod = this.product();
    if (!prod) return;

    this.transferConfirmed.emit({
      productId: prod.id,
      quantity: this.quantity(),
      notes: this.notes(),
    });
    this.open.set(false);
  }
}
