import type { Meta, StoryObj } from '@storybook/angular';

import { SearchBar } from './search-bar';

const meta: Meta<SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  args: {
    placeholder: 'Buscar producto o código de barras…',
    scannerActive: false,
    value: '',
  },
  argTypes: {
    searched: { action: 'searched' },
    searchChange: { action: 'searchChange' },
    cleared: { action: 'cleared' },
  },
};

export default meta;
type Story = StoryObj<SearchBar>;

export const Default: Story = {};

export const ScannerActive: Story = {
  args: {
    scannerActive: true,
    placeholder: 'Esperando escaneo de código de barras…',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Inca Kola 500ml',
  },
};
