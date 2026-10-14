import { Component, input } from '@angular/core';

/**
 * Molécula: Campo de formulario (`ui-form-field`).
 * - Combina etiqueta, texto de ayuda, mensaje de error accesible y proyección de control.
 */
@Component({
  selector: 'ui-form-field',
  templateUrl: './form-field.html',
})
export class FormField {
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly required = input(false);
  readonly htmlFor = input<string>('', { alias: 'for' });
  readonly customClass = input('', { alias: 'class' });
}
