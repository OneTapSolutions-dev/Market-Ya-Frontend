import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import * as XLSX from 'xlsx';

import { Store } from '../../core/services/store';
import { ToastStore } from '../../core/services/toast-store';
import { Button } from '../../ui/atoms/button';
import { Icon } from '../../ui/atoms/icon';
import { CashCloseModal } from '../../ui/organisms/cash-close-modal';
import { CashReopenModal } from '../../ui/organisms/cash-reopen-modal';
import { CashShiftSummary } from '../../ui/organisms/cash-shift-summary';

/**
 * Página: Gestión de Arqueo, Cierre y Auditoría de Caja (`cash-closure-page`).
 */
@Component({
  selector: 'ui-cash-closure-page',
  imports: [DecimalPipe, Button, Icon, CashCloseModal, CashReopenModal, CashShiftSummary],
  templateUrl: './cash-closure-page.html',
})
export class CashClosurePage {
  readonly store = inject(Store);
  private readonly toastStore = inject(ToastStore);

  readonly closeShiftModalOpen = signal(false);
  readonly reopenShiftModalOpen = signal(false);

  onShiftClosed(declaredCash: number): void {
    this.store.closeShift(declaredCash);
  }

  onShiftReopened(reason: string): void {
    this.store.reopenShift(reason);
  }

  exportShiftHistory(): void {
    const list = this.store.closedShiftHistory();
    if (list.length === 0) {
      this.toastStore.info('Sin Historial', 'No hay turnos cerrados para exportar.');
      return;
    }

    const rows = list.map((s) => ({
      Turno: s.shiftNumber,
      Cajero: s.cashierName,
      Apertura: s.openedAt,
      Cierre: s.closedAt,
      FondoApertura: s.openingBalance,
      EfectivoEsperado: s.expectedCash,
      EfectivoContado: s.actualCash,
      Yape: s.expectedYape,
      Plin: s.expectedPlin,
      TarjetaPOS: s.expectedCard,
      Diferencia: s.discrepancy,
      Estado: s.status,
      MotivoReapertura: s.reopenReason || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial Cierres');
    XLSX.writeFile(wb, `cierres_caja_${new Date().toISOString().split('T')[0]}.xlsx`);
    this.toastStore.success('Excel Generado', 'Se descargó el historial de turnos de caja.');
  }
}
