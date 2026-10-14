import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button (atoms/button)', () => {
  it('renderiza el texto del label correctamente', async () => {
    await render(Button, { inputs: { label: 'Guardar Cambios' } });
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeTruthy();
  });

  it('emite el evento `clicked` al hacer clic', async () => {
    const clicked = vi.fn();
    await render(Button, {
      inputs: { label: 'Aceptar' },
      on: { clicked },
    });

    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));
    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it('se deshabilita cuando `disabled` es true', async () => {
    await render(Button, { inputs: { label: 'Inactivo', disabled: true } });
    const btn = screen.getByRole('button', { name: /inactivo/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('indica estado aria-busy y desactiva el botón cuando `loading` es true', async () => {
    await render(Button, { inputs: { label: 'Procesando', loading: true } });
    const btn = screen.getByRole('button', { name: /procesando/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('aplica clases semánticas para variant=primary', async () => {
    await render(Button, { inputs: { label: 'Primario', variant: 'primary' } });
    const btn = screen.getByRole('button', { name: /primario/i });
    expect(btn.classList.contains('btn-primary')).toBe(true);
  });
});
