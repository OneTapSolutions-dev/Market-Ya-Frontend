import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SupplierPolicy } from '../../../core/services/store';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Lista de tarjetas de políticas de proveedores y registro de nuevas reglas (`ui-supplier-policies-list`).
 */
@Component({
  selector: 'ui-supplier-policies-list',
  imports: [FormsModule, Button, Icon, Modal],
  templateUrl: './supplier-policies-list.html',
})
export class SupplierPoliciesList {
  readonly policies = input.required<SupplierPolicy[]>();

  readonly policyAdded = output<SupplierPolicy>();
  readonly exportCanjesRequested = output<void>();

  readonly addModalOpen = signal(false);

  readonly name = signal('');
  readonly ruc = signal('');
  readonly contactName = signal('');
  readonly phone = signal('');
  readonly email = signal('');
  readonly hasPolicy = signal(true);
  readonly daysLimit = signal(30);
  readonly description = signal('');

  openAddModal(): void {
    this.name.set('');
    this.ruc.set('');
    this.contactName.set('');
    this.phone.set('');
    this.email.set('');
    this.hasPolicy.set(true);
    this.daysLimit.set(30);
    this.description.set('');
    this.addModalOpen.set(true);
  }

  savePolicy(): void {
    const supName = this.name().trim();
    if (!supName) return;

    const newPolicy: SupplierPolicy = {
      id: `SUP-${Date.now()}`,
      name: supName,
      ruc: this.ruc().trim() || undefined,
      contactName: this.contactName().trim() || undefined,
      phone: this.phone().trim() || undefined,
      email: this.email().trim() || undefined,
      hasPolicy: this.hasPolicy(),
      daysLimit: this.daysLimit(),
      badgeColor: this.daysLimit() <= 15 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-teal-100 text-teal-800 border-teal-200',
      description: this.description().trim() || 'Política estándar de canjes y devoluciones.',
    };

    this.policyAdded.emit(newPolicy);
    this.addModalOpen.set(false);
  }

  exportCanjes(): void {
    this.exportCanjesRequested.emit();
  }
}
