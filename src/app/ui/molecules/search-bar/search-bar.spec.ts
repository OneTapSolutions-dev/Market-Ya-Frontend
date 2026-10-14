import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';

import { SearchBar } from './search-bar';

describe('SearchBar (molecules/search-bar)', () => {
  it('renderiza con el placeholder especificado', async () => {
    await render(SearchBar, {
      inputs: { placeholder: 'Buscar por código SKU...' },
    });
    expect(screen.getByPlaceholderText('Buscar por código SKU...')).toBeTruthy();
  });

  it('emite searchChange al escribir en el campo', async () => {
    const searchChange = vi.fn();
    await render(SearchBar, {
      on: { searchChange },
    });

    const input = screen.getByLabelText(/buscar producto/i);
    fireEvent.input(input, { target: { value: 'Inca Kola' } });

    expect(searchChange).toHaveBeenCalledWith('Inca Kola');
  });

  it('emite searched al presionar Enter', async () => {
    const searched = vi.fn();
    await render(SearchBar, {
      inputs: { value: 'Arroz Extra' },
      on: { searched },
    });

    const input = screen.getByLabelText(/buscar producto/i);
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });

    expect(searched).toHaveBeenCalledWith('Arroz Extra');
  });

  it('limpia el texto y emite cleared al hacer clic en el botón limpiar', async () => {
    const cleared = vi.fn();
    const searchChange = vi.fn();
    await render(SearchBar, {
      inputs: { value: 'Leche Gloria' },
      on: { cleared, searchChange },
    });

    const clearBtn = screen.getByLabelText(/limpiar búsqueda/i);
    fireEvent.click(clearBtn);

    expect(cleared).toHaveBeenCalledTimes(1);
    expect(searchChange).toHaveBeenCalledWith('');
  });
});
