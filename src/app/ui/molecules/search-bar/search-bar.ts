import { Component, input, model, output } from '@angular/core';

import { Icon } from '../../atoms/icon';

/**
 * Molécula: Barra de búsqueda (`ui-search-bar`).
 * - Combina icono de escáner/búsqueda, campo de texto, botón limpiar y acción de búsqueda.
 */
@Component({
  selector: 'ui-search-bar',
  imports: [Icon],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  readonly value = model('');
  readonly placeholder = input('Buscar producto o código de barras…');
  readonly scannerActive = input(false);
  readonly customClass = input('', { alias: 'class' });

  readonly searched = output<string>();
  readonly searchChange = output<string>();
  readonly cleared = output<void>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.searchChange.emit(target.value);
  }

  onSearch(): void {
    this.searched.emit(this.value());
  }

  onClear(): void {
    this.value.set('');
    this.searchChange.emit('');
    this.cleared.emit();
  }
}
