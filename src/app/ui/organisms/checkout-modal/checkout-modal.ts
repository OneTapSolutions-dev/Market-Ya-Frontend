import { DecimalPipe } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerInfo, DocumentType, PaymentMethod } from '../../../core/models/sale.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Input } from '../../atoms/input';
import { Select } from '../../atoms/select';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Modal de Cobro y Facturación SUNAT (`ui-checkout-modal`).
 * - Selección de comprobante (Boleta/Factura/Nota de Venta), datos del cliente, método de pago y vuelto.
 */
@Component({
  selector: 'ui-checkout-modal',
  imports: [DecimalPipe, FormsModule, Button, Icon, Input, Select, Modal],
  templateUrl: './checkout-modal.html',
})
export class CheckoutModal {
  readonly open = model(false);
  readonly total = input.required<number>();

  readonly saleConfirmed = output<{
    documentType: DocumentType;
    customer: CustomerInfo;
    paymentMethod: PaymentMethod;
    amountPaid: number;
  }>();

  readonly documentType = signal<DocumentType>('BOLETA');
  readonly paymentMethod = signal<PaymentMethod>('EFECTIVO');
  readonly docType = signal<'DNI' | 'RUC' | 'VARIO'>('DNI');
  readonly docNumber = signal('');
  readonly customerName = signal('CLIENTE VARIOS');
  readonly amountPaid = signal<number>(0);

  readonly changeAmount = computed(() => {
    return Math.max(0, this.amountPaid() - this.total());
  });

  readonly isPaymentSufficient = computed(() => {
    if (this.paymentMethod() === 'EFECTIVO') {
      return this.amountPaid() >= this.total();
    }
    return true;
  });

  setDocumentType(type: DocumentType): void {
    this.documentType.set(type);
    if (type === 'FACTURA') {
      this.docType.set('RUC');
      this.customerName.set('');
    } else {
      this.docType.set('DNI');
      if (!this.customerName()) this.customerName.set('CLIENTE VARIOS');
    }
  }

  setExactAmount(): void {
    this.amountPaid.set(this.total());
  }

  addAmount(extra: number): void {
    this.amountPaid.set(Number((this.amountPaid() + extra).toFixed(2)));
  }

  confirmSale(): void {
    this.saleConfirmed.emit({
      documentType: this.documentType(),
      customer: {
        docType: this.docType(),
        docNumber: this.docNumber(),
        name: this.customerName() || 'CLIENTE VARIOS',
      },
      paymentMethod: this.paymentMethod(),
      amountPaid: this.paymentMethod() === 'EFECTIVO' ? this.amountPaid() : this.total(),
    });
    this.open.set(false);
  }
}
