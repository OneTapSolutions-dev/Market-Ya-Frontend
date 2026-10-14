import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PackComponent, Product } from '../../../core/models/product.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';

/**
 * Organismo: Catálogo y diseñador de packs y combos promocionales (`ui-packs-table`).
 */
@Component({
  selector: 'ui-packs-table',
  imports: [DecimalPipe, FormsModule, Button, Icon, Modal],
  templateUrl: './packs-table.html',
})
export class PacksTable {
  readonly products = input.required<Product[]>();
  readonly packs = input.required<Product[]>();

  readonly packSaved = output<Product>();
  readonly packDeleted = output<string>();

  readonly searchQuery = signal('');
  readonly modalOpen = signal(false);
  readonly editingPackId = signal<string | null>(null);

  // Formulario del diseñador
  readonly newPackName = signal('');
  readonly newPackBarcode = signal('');
  readonly newPackCategory = signal('Promociones');
  readonly newPackPrice = signal<number>(0);
  readonly components = signal<PackComponent[]>([]);

  // Búsqueda de productos en el modal
  readonly productSearch = signal('');

  readonly filteredPacks = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.packs().filter((p) => {
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q);
    });
  });

  readonly searchProductResults = computed(() => {
    const q = this.productSearch().trim().toLowerCase();
    if (!q) return [];
    return this.products()
      .filter((p) => !p.isPack && (p.name.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)))
      .slice(0, 5);
  });

  readonly totalCost = computed(() => {
    return this.components().reduce((sum, c) => sum + c.unitCost * c.quantity, 0);
  });

  readonly totalSuggestedPrice = computed(() => {
    return this.components().reduce((sum, c) => sum + c.unitSalePrice * c.quantity, 0);
  });

  readonly marginPercent = computed(() => {
    const cost = this.totalCost();
    const price = this.newPackPrice();
    if (cost <= 0) return 0;
    return ((price - cost) / cost) * 100;
  });

  openModal(pack?: Product): void {
    if (pack) {
      this.editingPackId.set(pack.id);
      this.newPackName.set(pack.name);
      this.newPackBarcode.set(pack.barcode);
      this.newPackCategory.set(pack.category);
      this.newPackPrice.set(pack.salePrice);
      this.components.set(pack.packComponents ? JSON.parse(JSON.stringify(pack.packComponents)) : []);
    } else {
      this.editingPackId.set(null);
      this.newPackName.set('');
      this.newPackBarcode.set(`PCK${Math.floor(100000 + Math.random() * 900000)}`);
      this.newPackCategory.set('Promociones');
      this.newPackPrice.set(0);
      this.components.set([]);
    }
    this.productSearch.set('');
    this.modalOpen.set(true);
  }

  generateBarcode(): void {
    this.newPackBarcode.set(`PCK${Math.floor(100000 + Math.random() * 900000)}`);
  }

  addComponent(p: Product): void {
    const list = [...this.components()];
    const existing = list.find((c) => c.productId === p.id);
    if (existing) {
      existing.quantity++;
    } else {
      list.push({
        productId: p.id,
        productName: p.name,
        quantity: 1,
        unitCost: p.costPrice,
        unitSalePrice: p.salePrice,
        unitOfMeasure: p.packaging,
      });
    }
    this.components.set(list);
    this.productSearch.set('');

    if (this.newPackPrice() <= this.totalCost()) {
      this.newPackPrice.set(Number((this.totalCost() * 1.2).toFixed(2)));
    }
  }

  removeComponent(index: number): void {
    this.components.update((list) => list.filter((_, i) => i !== index));
  }

  savePack(): void {
    const name = this.newPackName().trim();
    if (!name || this.components().length < 2 || this.newPackPrice() <= this.totalCost()) return;

    const id = this.editingPackId() || `prod-pack-${Date.now()}`;
    const packProduct: Product = {
      id,
      barcode: this.newPackBarcode(),
      sku: this.newPackBarcode(),
      category: this.newPackCategory(),
      subcategory: 'Packs',
      brand: 'Propia',
      name,
      presentation: 'Combo/Pack',
      packaging: 'Virtual',
      costPrice: this.totalCost(),
      salePrice: this.newPackPrice(),
      stockAlmacen: 0,
      stockGondola: 999,
      minGondola: 0,
      unitsPerBox: 1,
      expirationDate: '2099-12-31',
      entryDate: new Date().toISOString().split('T')[0],
      supplierInvoiceDate: new Date().toISOString().split('T')[0],
      supplier: 'Interno',
      exchangeDaysLimit: 0,
      isPack: true,
      packComponents: this.components(),
      status: 'NORMAL',
    };

    this.packSaved.emit(packProduct);
    this.modalOpen.set(false);
  }

  deletePack(packId: string): void {
    this.packDeleted.emit(packId);
  }
}
