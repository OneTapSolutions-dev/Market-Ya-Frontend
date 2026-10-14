import type { Meta, StoryObj } from '@storybook/angular';

import { CartItemRow } from './cart-item-row';

const meta: Meta<CartItemRow> = {
  title: 'Molecules/CartItemRow',
  component: CartItemRow,
  args: {
    displayName: 'Arroz Costeño Extra 1kg',
    sku: 'ABR-002',
    unitPrice: 4.8,
    quantity: 3,
    subtotal: 14.4,
    tier: 'UNIDAD',
    unitsPerItem: 1,
  },
  argTypes: {
    quantityChanged: { action: 'quantityChanged' },
    removed: { action: 'removed' },
    tier: {
      control: 'select',
      options: ['UNIDAD', 'PACK', 'CAJA'],
    },
  },
};

export default meta;
type Story = StoryObj<CartItemRow>;

export const SingleUnit: Story = {};

export const PackItem: Story = {
  args: {
    displayName: 'Combo Desayuno (Leche + Avena)',
    sku: 'PCK-001',
    unitPrice: 9.5,
    quantity: 1,
    subtotal: 9.5,
    tier: 'PACK',
    unitsPerItem: 2,
  },
};

export const BoxItem: Story = {
  args: {
    displayName: 'Caja Cerveza Cusqueña x24',
    sku: 'BEB-015',
    unitPrice: 120.0,
    quantity: 2,
    subtotal: 240.0,
    tier: 'CAJA',
    unitsPerItem: 24,
  },
};
