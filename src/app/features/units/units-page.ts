import { Component, inject, signal } from '@angular/core';

import { ToastStore } from '../../core/services/toast-store';
import { UnitOfMeasure, UnitsTable } from '../../ui/organisms/units-table';

/**
 * Página: Unidades de Medida para Empaques y Granel (`units-page`).
 */
@Component({
  selector: 'ui-units-page',
  imports: [UnitsTable],
  templateUrl: './units-page.html',
})
export class UnitsPage {
  private readonly toastStore = inject(ToastStore);

  readonly units = signal<UnitOfMeasure[]>([
    { id: 'UM-001', name: 'Unidad', abbreviation: 'UND', description: 'Unidad suelta / pieza individual', status: 'ACTIVO' },
    { id: 'UM-002', name: 'Caja', abbreviation: 'CJ', description: 'Caja completa', status: 'ACTIVO' },
    { id: 'UM-003', name: 'Paquete', abbreviation: 'PQ', description: 'Paquete o Six-Pack', status: 'ACTIVO' },
    { id: 'UM-004', name: 'Saco', abbreviation: 'SC', description: 'Saco de productos a granel', status: 'ACTIVO' },
    { id: 'UM-005', name: 'Display', abbreviation: 'DP', description: 'Display mostrador', status: 'ACTIVO' },
  ]);

  onUnitSaved(unit: UnitOfMeasure): void {
    const list = [...this.units()];
    const idx = list.findIndex((u) => u.id === unit.id);
    if (idx !== -1) {
      list[idx] = unit;
      this.toastStore.success('Unidad Actualizada', `Se guardaron los cambios para ${unit.name}.`);
    } else {
      list.push(unit);
      this.toastStore.success('Unidad Creada', `Se registró la unidad ${unit.name}.`);
    }
    this.units.set(list);
  }
}
