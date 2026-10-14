import type { Meta, StoryObj } from '@storybook/angular';

import { Badge } from './badge';

const meta: Meta<Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  args: {
    label: 'Normal',
    variant: 'success',
    size: 'md',
    outline: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<Badge>;

export const Success: Story = {
  args: { variant: 'success', label: 'Stock Suficiente' },
};

export const Warning: Story = {
  args: { variant: 'warning', label: 'Stock Bajo Góndola' },
};

export const Error: Story = {
  args: { variant: 'error', label: 'Alerta Vencimiento' },
};

export const Info: Story = {
  args: { variant: 'info', label: 'Aceptado SUNAT' },
};

export const Outline: Story = {
  args: { variant: 'primary', label: 'Doble Kardex', outline: true },
};
