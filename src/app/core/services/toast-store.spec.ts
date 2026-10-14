import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastStore } from './toast-store';

describe('ToastStore (core/services)', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  it('apila y descarta toasts manualmente', () => {
    const store = TestBed.inject(ToastStore);

    const id = store.addToast('success', 'Operación exitosa', 'Datos guardados', 0);
    expect(store.toasts().length).toBe(1);
    expect(store.toasts()[0].title).toBe('Operación exitosa');

    store.removeToast(id);
    expect(store.toasts().length).toBe(0);
  });

  it('auto-descarta tras la duración especificada', () => {
    vi.useFakeTimers();
    const store = TestBed.inject(ToastStore);

    store.success('Venta completada', 'Comprobante emitido');
    expect(store.toasts().length).toBe(1);

    vi.advanceTimersByTime(5000);
    expect(store.toasts().length).toBe(0);
  });

  it('permite registrar tipos error, warning e info', () => {
    const store = TestBed.inject(ToastStore);

    store.error('Error al emitir', 'Fallo de conexión');
    store.warning('Stock bajo', 'Góndola vacía');
    store.info('Sincronización', 'Kardex actualizado');

    expect(store.toasts().length).toBe(3);
    expect(store.toasts().map((t) => t.type)).toEqual(['error', 'warning', 'info']);
  });
});
