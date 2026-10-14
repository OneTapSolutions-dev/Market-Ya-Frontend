import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

describe('Badge (atoms/badge)', () => {
  it('renderiza el contenido del label', async () => {
    await render(Badge, { inputs: { label: 'En Stock' } });
    expect(screen.getByText('En Stock')).toBeTruthy();
  });

  it('aplica las clases semánticas para variant=success', async () => {
    const { container } = await render(Badge, {
      inputs: { label: 'Activo', variant: 'success' },
    });
    const span = container.querySelector('span');
    expect(span?.classList.contains('badge-success')).toBe(true);
  });

  it('aplica badge-outline cuando outline=true', async () => {
    const { container } = await render(Badge, {
      inputs: { label: 'Contorno', outline: true },
    });
    const span = container.querySelector('span');
    expect(span?.classList.contains('badge-outline')).toBe(true);
  });
});
