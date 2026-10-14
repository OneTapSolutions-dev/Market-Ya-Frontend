import type { Meta, StoryObj } from '@storybook/angular';

import { KpiMetric } from './kpi-metric';

const meta: Meta<KpiMetric> = {
  title: 'Atoms/KpiMetric',
  component: KpiMetric,
  args: {
    label: 'Venta Total Hoy',
    value: 'S/ 1,480.50',
    subtext: '+12% vs ayer',
    color: 'orange',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['orange', 'teal', 'amber', 'rose', 'sky', 'emerald'],
    },
  },
};

export default meta;
type Story = StoryObj<KpiMetric>;

export const SalesToday: Story = {
  args: {
    label: 'Venta Total Hoy',
    value: 'S/ 1,480.50',
    subtext: '+12.4% vs día anterior',
    color: 'orange',
    icon: 'banknotes',
  },
};

export const Transactions: Story = {
  args: {
    label: 'Transacciones Realizadas',
    value: 64,
    subtext: 'Ticket prom: S/ 23.10',
    color: 'teal',
    icon: 'shoppingCart',
  },
};

export const LowStockWarning: Story = {
  args: {
    label: 'Stock Bajo Góndola',
    value: 8,
    subtext: 'Requiere recarga de almacén',
    color: 'amber',
    icon: 'exclamationTriangle',
  },
};
