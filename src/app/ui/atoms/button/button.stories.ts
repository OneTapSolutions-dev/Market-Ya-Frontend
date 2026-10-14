import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Atoms/Button',
  component: Button,
  args: {
    label: 'Continuar Venta',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
  },
  argTypes: {
    clicked: { action: 'clicked' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'ghost', 'danger', 'warning', 'error', 'outline'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: { variant: 'primary', label: 'Cobrar S/ 15.50' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Reabrir Caja' },
};

export const Accent: Story = {
  args: { variant: 'accent', label: 'Oferta Especial' },
};

export const Outline: Story = {
  args: { variant: 'outline', label: 'Exportar Excel' },
};

export const Danger: Story = {
  args: { variant: 'danger', label: 'Anular Documento' },
};

export const Loading: Story = {
  args: { loading: true, label: 'Emitiendo a SUNAT…' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Acción Bloqueada' },
};
