import { Component, computed, input, output, signal } from '@angular/core';

import { Product } from '../../../core/models/product.model';
import { Icon } from '../../atoms/icon';
import { Select } from '../../atoms/select';
import { ProductPosCard } from '../../molecules/product-pos-card';
import { SearchBar } from '../../molecules/search-bar';

/**
 * Organismo: Catálogo de productos para el terminal de ventas POS (`ui-pos-catalog`).
 * - Incluye buscador con soporte de lector de código de barras, filtro por categoría y grid responsivo.
 */
@Component({
  selector: 'ui-pos-catalog',
  imports: [Icon, Select, ProductPosCard, SearchBar],
  templateUrl: './pos-catalog.html',
})
export class PosCatalog {
  readonly products = input.required<Product[]>();
  readonly categories = input<string[]>([]);
  readonly loading = input(false);
  readonly customClass = input('', { alias: 'class' });

  readonly productSelected = output<Product>();
  readonly productDetailRequested = output<Product>();

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('');

  readonly filteredProducts = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();

    return this.products().filter((p) => {
      const matchesCategory = !cat || p.category === cat;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  });

  onBarcodeSearch(): void {
    const prods = this.filteredProducts();
    if (prods.length === 1) {
      this.productSelected.emit(prods[0]);
    }
  }
}
