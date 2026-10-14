import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';

import { CartItemRow } from './cart-item-row';

describe('CartItemRow (molecules/cart-item-row)', () => {
  const defaultInputs = {
    displayName: 'Aceite Primor 1L',
    sku: 'ACE-001',
    unitPrice: 8.5,
    quantity: 2,
    subtotal: 17.0,
    tier: 'UNIDAD' as const,
    unitsPerItem: 1,
  };

  it('renderiza el nombre del producto, SKU y precios', async () => {
    await render(CartItemRow, { inputs: defaultInputs });

    expect(screen.getByText('Aceite Primor 1L')).toBeTruthy();
    expect(screen.getByText('SKU: ACE-001')).toBeTruthy();
    expect(screen.getByText('S/ 17.00')).toBeTruthy();
  });

  it('emite incremento (+1) y decremento (-1) de cantidad', async () => {
    const quantityChanged = vi.fn();
    await render(CartItemRow, {
      inputs: defaultInputs,
      on: { quantityChanged },
    });

    const incBtn = screen.getByLabelText(/aumentar cantidad/i);
    fireEvent.click(incBtn);
    expect(quantityChanged).toHaveBeenCalledWith(1);

    const decBtn = screen.getByLabelText(/disminuir cantidad/i);
    fireEvent.click(decBtn);
    expect(quantityChanged).toHaveBeenCalledWith(-1);
  });

  it('emite evento removed al pulsar eliminar', async () => {
    const removed = vi.fn();
    await render(CartItemRow, {
      inputs: defaultInputs,
      on: { removed },
    });

    const removeBtn = screen.getByLabelText(/eliminar/i);
    fireEvent.click(removeBtn);
    expect(removed).toHaveBeenCalledTimes(1);
  });
});
