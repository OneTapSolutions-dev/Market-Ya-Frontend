import { Component, computed, inject } from '@angular/core';

import { Product } from '../../core/models/product.model';
import { Store } from '../../core/services/store';
import { ToastStore } from '../../core/services/toast-store';
import { PacksTable } from '../../ui/organisms/packs-table';

/**
 * Página: Armado y Costeo de Packs y Combos Promocionales (`packs-page`).
 */
@Component({
  selector: 'ui-packs-page',
  imports: [PacksTable],
  templateUrl: './packs-page.html',
})
export class PacksPage {
  readonly store = inject(Store);
  private readonly toastStore = inject(ToastStore);

  readonly packs = computed(() => {
    return this.store.products().filter((p) => p.isPack);
  });

  onPackSaved(pack: Product): void {
    const list = [...this.store.products()];
    const idx = list.findIndex((p) => p.id === pack.id);
    if (idx !== -1) {
      list[idx] = pack;
      this.toastStore.success('Pack Actualizado', `El combo "${pack.name}" ha sido actualizado.`);
    } else {
      list.push(pack);
      this.toastStore.success('Pack Creado', `El combo "${pack.name}" fue agregado al catálogo.`);
    }
    this.store.products.set(list);
  }

  onPackDeleted(id: string): void {
    this.store.products.update((list) => list.filter((p) => p.id !== id));
    this.toastStore.info('Pack Eliminado', 'El combo fue retirado del catálogo.');
  }
}
