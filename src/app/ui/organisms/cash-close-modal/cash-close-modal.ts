import { DecimalPipe } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CashShift } from '../../../core/models/sale.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Modal de arqueo y cierre de caja (`ui-cash-close-modal`).
 */
@Component({
  selector: 'ui-cash-close-modal',
  imports: [DecimalPipe, FormsModule, Button, Icon, Modal],
  templateUrl: './cash-close-modal.html',
})
export class CashCloseModal {
  readonly open = model(false);
  readonly shift = input.required<CashShift>();

  readonly shiftClosed = output<number>();

  readonly actualCash = signal<number>(0);

  readonly expectedCash = computed(() => {
    return this.shift().expectedCash;
  });

  readonly paymentTotals = computed(() => {
    const s = this.shift();
    return [
      { label: 'Efectivo Sistema', amount: s.expectedCash, color: 'text-orange-600' },
      { label: 'Yape', amount: s.expectedYape, color: 'text-purple-700' },
      { label: 'Plin', amount: s.expectedPlin, color: 'text-teal-700' },
      { label: 'Tarjetas POS', amount: s.expectedCard, color: 'text-blue-700' },
    ];
  });

  readonly paymentMethodsTotal = computed(() => {
    const s = this.shift();
    return s.expectedCash + s.expectedYape + s.expectedPlin + s.expectedCard;
  });

  readonly discrepancy = computed(() => {
    return this.actualCash() - this.expectedCash();
  });

  setDeclaredCash(value: string | number): void {
    const numeric = typeof value === 'number' ? value : parseFloat(value) || 0;
    this.actualCash.set(numeric);
  }

  confirmClose(): void {
    this.shiftClosed.emit(this.actualCash());
    this.open.set(false);
  }

  cancel(): void {
    this.open.set(false);
  }
}
