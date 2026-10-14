import { Component, input, model, output, signal } from '@angular/core';

import { Product } from '../../../core/models/product.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Input } from '../../atoms/input';
import { Select } from '../../atoms/select';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Modal de alta de nuevo producto (`ui-product-form-modal`).
 */
@Component({
  selector: 'ui-product-form-modal',
  imports: [Button, Icon, Input, Select, Modal],
  templateUrl: './product-form-modal.html',
})
export class ProductFormModal {
  readonly open = model(false);
  readonly categories = input<string[]>([]);

  readonly productCreated = output<Product>();

  readonly name = signal('');
  readonly sku = signal('');
  readonly category = signal('Bebidas');
  readonly brand = signal('Generico');
  readonly costPrice = signal<number>(0);
  readonly salePrice = signal<number>(0);
  readonly stockAlmacen = signal<number>(50);
  readonly stockGondola = signal<number>(15);
  readonly minGondola = signal<number>(5);
  readonly unitsPerBox = signal<number>(24);
  readonly expirationDate = signal('2026-12-31');
  readonly supplier = signal('Proveedor Local');

  submit(): void {
    if (!this.name() || !this.sku()) return;

    const newProd: Product = {
      id: `PROD-${Date.now()}`,
      barcode: `775${Math.floor(10000000 + Math.random() * 90000000)}`,
      sku: this.sku(),
      name: this.name(),
      category: this.category(),
      subcategory: 'General',
      brand: this.brand(),
      presentation: 'Unidad',
      packaging: 'Empaque',
      costPrice: this.costPrice(),
      salePrice: this.salePrice(),
      stockAlmacen: this.stockAlmacen(),
      stockGondola: this.stockGondola(),
      minGondola: this.minGondola(),
      unitsPerBox: this.unitsPerBox(),
      expirationDate: this.expirationDate(),
      entryDate: new Date().toISOString().split('T')[0],
      supplierInvoiceDate: new Date().toISOString().split('T')[0],
      supplier: this.supplier(),
      exchangeDaysLimit: 30,
      status: this.stockGondola() <= this.minGondola() ? 'STOCK_BAJO' : 'NORMAL',
    };

    this.productCreated.emit(newProd);
    this.open.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.name.set('');
    this.sku.set('');
    this.costPrice.set(0);
    this.salePrice.set(0);
  }
}
