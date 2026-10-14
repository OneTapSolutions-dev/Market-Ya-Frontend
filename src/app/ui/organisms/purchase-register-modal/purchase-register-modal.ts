import { DecimalPipe } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../core/models/product.model';
import { PurchaseItem, PurchaseRecord } from '../../../core/models/sale.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Modal de registro multi-producto de factura de compra a proveedor (`ui-purchase-register-modal`).
 */
@Component({
  selector: 'ui-purchase-register-modal',
  imports: [DecimalPipe, FormsModule, Button, Icon, Modal],
  templateUrl: './purchase-register-modal.html',
})
export class PurchaseRegisterModal {
  readonly open = model(false);
  readonly availableProducts = input.required<Product[]>();
  readonly currentUser = input<string>('Administrador');

  readonly purchaseRegistered = output<PurchaseRecord>();

  // Cabecera de compra
  readonly invoiceNumber = signal('');
  readonly supplierName = signal('');
  readonly paymentType = signal<'CONTADO_EFECTIVO' | 'CREDITO_30_DIAS' | 'TRANSFERENCIA'>('CONTADO_EFECTIVO');
  readonly invoiceDate = signal(new Date().toISOString().split('T')[0]);

  // Ítems
  readonly items = signal<PurchaseItem[]>([]);

  // Draft de nuevo ítem
  readonly selectedProductId = signal('');
  readonly itemQuantity = signal(1);
  readonly itemCost = signal(0);
  readonly itemSuggestedPrice = signal(0);
  readonly itemExpDate = signal('');

  readonly totalCost = computed(() => {
    return this.items().reduce((sum, item) => sum + item.totalCost, 0);
  });

  onProductSelected(prodId: string): void {
    this.selectedProductId.set(prodId);
    const prod = this.availableProducts().find((p) => p.id === prodId);
    if (prod) {
      this.itemCost.set(prod.costPrice);
      this.itemSuggestedPrice.set(prod.salePrice);
      this.itemExpDate.set(prod.expirationDate);
    }
  }

  addItem(): void {
    const prod = this.availableProducts().find((p) => p.id === this.selectedProductId());
    if (!prod || this.itemQuantity() <= 0 || this.itemCost() <= 0) return;

    const newItem: PurchaseItem = {
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      category: prod.category,
      quantity: this.itemQuantity(),
      unitCost: this.itemCost(),
      totalCost: Number((this.itemQuantity() * this.itemCost()).toFixed(2)),
      suggestedSalePrice: this.itemSuggestedPrice(),
      expirationDate: this.itemExpDate() || prod.expirationDate,
    };

    this.items.update((list) => [...list, newItem]);

    // Reset draft
    this.selectedProductId.set('');
    this.itemQuantity.set(1);
    this.itemCost.set(0);
    this.itemSuggestedPrice.set(0);
    this.itemExpDate.set('');
  }

  removeItem(index: number): void {
    this.items.update((list) => list.filter((_, i) => i !== index));
  }

  savePurchase(): void {
    if (!this.invoiceNumber().trim() || !this.supplierName().trim() || this.items().length === 0) return;

    const record: PurchaseRecord = {
      id: `PUR-${Date.now()}`,
      invoiceNumber: this.invoiceNumber().trim(),
      supplierName: this.supplierName().trim(),
      dateTime: new Date().toISOString(),
      invoiceDate: this.invoiceDate(),
      totalCost: this.totalCost(),
      paymentType: this.paymentType(),
      receivedBy: this.currentUser(),
      status: 'INGRESO_ALMACEN',
      items: this.items(),
    };

    this.purchaseRegistered.emit(record);
    this.resetForm();
    this.open.set(false);
  }

  cancel(): void {
    this.resetForm();
    this.open.set(false);
  }

  private resetForm(): void {
    this.invoiceNumber.set('');
    this.supplierName.set('');
    this.paymentType.set('CONTADO_EFECTIVO');
    this.items.set([]);
    this.selectedProductId.set('');
    this.itemQuantity.set(1);
    this.itemCost.set(0);
  }
}
