import { Component, inject, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Store } from '../../../core/services/store';
import { Icon } from '../../atoms/icon';

/**
 * Organismo: Menú de navegación desplegable para móviles (`ui-mobile-nav`).
 */
@Component({
  selector: 'ui-mobile-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './mobile-nav.html',
})
export class MobileNav {
  readonly store = inject(Store);
  readonly open = model(false);

  close(): void {
    this.open.set(false);
  }
}
