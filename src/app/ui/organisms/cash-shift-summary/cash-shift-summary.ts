import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { CashShift } from '../../../core/models/sale.model';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';

/**
 * Organismo: Resumen del turno de caja actual (`ui-cash-shift-summary`).
 * - Muestra desglose por medio de pago (Efectivo, Yape, Plin, Tarjeta) y botones de acción de cierre/reapertura.
 */
@Component({
  selector: 'ui-cash-shift-summary',
  imports: [DecimalPipe, Badge, Button, Icon],
  templateUrl: './cash-shift-summary.html',
})
export class CashShiftSummary {
  readonly shift = input.required<CashShift>();
  readonly isAdmin = input(false);

  readonly closeRequested = output<void>();
  readonly reopenRequested = output<void>();

  readonly totalExpected = computed(() => {
    const s = this.shift();
    return s.openingBalance + s.expectedCash + s.expectedYape + s.expectedPlin + s.expectedCard;
  });
}
