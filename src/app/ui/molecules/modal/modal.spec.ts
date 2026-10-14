import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './modal';

describe('Modal (molecules/modal)', () => {
  it('no muestra el diálogo si open es false', async () => {
    await render(Modal, {
      inputs: { open: false, title: 'Ventana de prueba' },
    });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('muestra el título y rol de diálogo cuando open es true', async () => {
    await render(Modal, {
      inputs: { open: true, title: 'Confirmar Operación' },
    });

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Confirmar Operación')).toBeTruthy();
  });

  it('cierra el modal y emite closed al pulsar el botón de cerrar', async () => {
    const closed = vi.fn();
    await render(Modal, {
      inputs: { open: true, title: 'Diálogo' },
      on: { closed },
    });

    const closeBtn = screen.getByLabelText(/cerrar ventana/i);
    fireEvent.click(closeBtn);

    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('cierra el modal al presionar la tecla Escape', async () => {
    const closed = vi.fn();
    await render(Modal, {
      inputs: { open: true, title: 'Diálogo con Escape' },
      on: { closed },
    });

    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    expect(closed).toHaveBeenCalledTimes(1);
  });
});
