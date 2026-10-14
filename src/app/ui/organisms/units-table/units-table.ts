import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';

export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  status: 'ACTIVO' | 'INACTIVO';
}

/**
 * Organismo: Gestión de unidades de medida para empaques y productos sueltos (`ui-units-table`).
 */
@Component({
  selector: 'ui-units-table',
  imports: [FormsModule, Button, Icon, Modal],
  templateUrl: './units-table.html',
})
export class UnitsTable {
  readonly units = input.required<UnitOfMeasure[]>();

  readonly unitSaved = output<UnitOfMeasure>();

  readonly modalOpen = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly name = signal('');
  readonly abbreviation = signal('');
  readonly description = signal('');
  readonly status = signal<'ACTIVO' | 'INACTIVO'>('ACTIVO');

  openModal(unit?: UnitOfMeasure): void {
    if (unit) {
      this.editingId.set(unit.id);
      this.name.set(unit.name);
      this.abbreviation.set(unit.abbreviation);
      this.description.set(unit.description);
      this.status.set(unit.status);
    } else {
      this.editingId.set(null);
      this.name.set('');
      this.abbreviation.set('');
      this.description.set('');
      this.status.set('ACTIVO');
    }
    this.modalOpen.set(true);
  }

  saveUnit(): void {
    const unitName = this.name().trim();
    const unitAbbr = this.abbreviation().trim().toUpperCase();
    if (!unitName || !unitAbbr) return;

    const unit: UnitOfMeasure = {
      id: this.editingId() ?? `UM-${Math.floor(100 + Math.random() * 900)}`,
      name: unitName,
      abbreviation: unitAbbr,
      description: this.description().trim(),
      status: this.status(),
    };

    this.unitSaved.emit(unit);
    this.modalOpen.set(false);
  }
}
