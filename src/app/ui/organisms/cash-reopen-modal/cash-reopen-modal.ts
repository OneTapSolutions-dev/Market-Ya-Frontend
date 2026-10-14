import { Component, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Modal de reapertura auditada de caja (`ui-cash-reopen-modal`).
 */
@Component({
  selector: 'ui-cash-reopen-modal',
  imports: [FormsModule, Button, Icon, Modal],
  templateUrl: './cash-reopen-modal.html',
})
export class CashReopenModal {
  readonly open = model(false);
  readonly shiftReopened = output<string>();

  readonly reason = signal('');

  confirmReopen(): void {
    const text = this.reason().trim();
    if (!text) return;
    this.shiftReopened.emit(text);
    this.reason.set('');
    this.open.set(false);
  }

  cancel(): void {
    this.reason.set('');
    this.open.set(false);
  }
}
