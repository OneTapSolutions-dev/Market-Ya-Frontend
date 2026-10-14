import { Component, input } from '@angular/core';

/**
 * Molécula: Tarjeta (`ui-card`).
 * - Mapea a clases daisyUI (`card`, `card-body`, `card-title`).
 */
@Component({
  selector: 'ui-card',
  templateUrl: './card.html',
})
export class Card {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly bordered = input(true);
  readonly customClass = input('', { alias: 'class' });
}
