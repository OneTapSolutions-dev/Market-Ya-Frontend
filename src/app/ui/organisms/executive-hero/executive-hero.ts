import { Component, input } from '@angular/core';

/**
 * Organismo: Banner ejecutivo de bienvenida (`ui-executive-hero`).
 * - Encabezado corporativo naranja con fecha actual y logotipo.
 */
@Component({
  selector: 'ui-executive-hero',
  templateUrl: './executive-hero.html',
})
export class ExecutiveHero {
  readonly userName = input('Administrador');

  get todayDate(): string {
    return new Date().toLocaleString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onLogoError(event: Event): void {
    (event.target as HTMLElement).style.display = 'none';
  }
}
