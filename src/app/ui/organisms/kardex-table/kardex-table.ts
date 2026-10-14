import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';

import { Product } from '../../../core/models/product.model';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Select } from '../../atoms/select';
import { SearchBar } from '../../molecules/search-bar';

/**
 * Organismo: Tabla de Inventario y Doble Kardex (`ui-kardex-table`).
 * - Muestra Almacén vs Góndola, estado de stock, alertas de reposición y acciones directas.
 */
@Component({
  selector: 'ui-kardex-table',
  imports: [DecimalPipe, Badge, Button, Icon, Select, SearchBar],
  templateUrl: './kardex-table.html',
})
export class KardexTable {
  readonly products = input.required<Product[]>();
  readonly categories = input<string[]>([]);
  readonly loading = input(false);

  readonly transferRequested = output<Product>();
  readonly detailRequested = output<Product>();
  readonly newProductRequested = output<void>();

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('');
  readonly selectedStatus = signal('TODOS');

  readonly filteredProducts = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();
    const stat = this.selectedStatus();

    return this.products().filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q);
      const matchesCategory = !cat || p.category === cat;
      const matchesStatus =
        stat === 'TODOS' ||
        (stat === 'BAJO' && p.stockGondola <= p.minGondola) ||
        (stat === 'NORMAL' && p.stockGondola > p.minGondola);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  });
}
