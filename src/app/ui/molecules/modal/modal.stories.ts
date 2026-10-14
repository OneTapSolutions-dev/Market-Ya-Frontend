import type { Meta, StoryObj } from '@storybook/angular';

import { Modal } from './modal';

const meta: Meta<Modal> = {
  title: 'Molecules/Modal',
  component: Modal,
  args: {
    open: true,
    title: 'Confirmación de Arqueo de Caja',
    size: 'md',
  },
  argTypes: {
    closed: { action: 'closed' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-modal [open]="open" [title]="title" [size]="size">
        <p class="text-xs text-slate-600 mb-4">
          Revise el saldo físico en caja antes de confirmar el cierre del turno del cajero.
        </p>
        <div modal-actions class="flex items-center justify-end gap-2">
          <button class="btn btn-ghost btn-sm">Cancelar</button>
          <button class="btn btn-primary btn-sm text-white">Confirmar Cierre</button>
        </div>
      </ui-modal>
    `,
  }),
};

export default meta;
type Story = StoryObj<Modal>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    title: 'Detalle de Factura Electrónica F001-00042',
    size: 'xl',
  },
};
