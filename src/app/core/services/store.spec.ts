import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { Product } from '../models/product.model';
import { Store } from './store';

describe('Store (core/services)', () => {
  let store: Store;

  const mockProduct: Product = {
    id: 'prod-001',
    sku: 'BEB-001',
    barcode: '7750123456789',
    name: 'Inca Kola 500ml',
    category: 'BEBIDAS',
    subcategory: 'Gaseosas',
    brand: 'Inca Kola',
    presentation: 'Botella 500ml',
    packaging: 'Plástico',
    supplier: 'Arca Continental Lindley',
    stockAlmacen: 50,
    stockGondola: 24,
    minGondola: 10,
    costPrice: 2.2,
    salePrice: 3.5,
    unitsPerBox: 24,
    expirationDate: '2026-12-31',
    entryDate: '2026-01-15',
    supplierInvoiceDate: '2026-01-15',
    exchangeDaysLimit: 45,
    status: 'NORMAL',
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = TestBed.inject(Store);
    store.clearCart();
  });

  it('inicia sesión y valida permisos por rol', () => {
    store.login('cajero1', 'cajero');
    expect(store.currentUser()?.role).toBe('cajero');
    expect(store.canAccess('pos')).toBe(true);
    expect(store.canAccess('dashboard')).toBe(false);

    store.login('admin1', 'admin');
    expect(store.currentUser()?.role).toBe('admin');
    expect(store.canAccess('dashboard')).toBe(true);
    expect(store.canAccess('pos')).toBe(true);
  });

  it('agrega productos al carrito y calcula subtotal', () => {
    store.addToCart(mockProduct, 2);
    expect(store.cart().length).toBe(1);
    expect(store.cart()[0].quantity).toBe(2);
    expect(store.cart()[0].subtotal).toBe(7.0);

    // Agregar el mismo producto incrementa la cantidad
    store.addToCart(mockProduct, 1);
    expect(store.cart().length).toBe(1);
    expect(store.cart()[0].quantity).toBe(3);
    expect(store.cart()[0].subtotal).toBe(10.5);
  });

  it('actualiza cantidades en el carrito y elimina al llegar a 0', () => {
    store.addToCart(mockProduct, 2);
    store.updateCartQuantity(mockProduct.id, 1);
    expect(store.cart()[0].quantity).toBe(3);

    store.updateCartQuantity(mockProduct.id, -2);
    expect(store.cart()[0].quantity).toBe(1);

    store.updateCartQuantity(mockProduct.id, -1);
    expect(store.cart().length).toBe(0);
  });

  it('vacía el carrito completamente', () => {
    store.addToCart(mockProduct, 5);
    expect(store.cart().length).toBe(1);

    store.clearCart();
    expect(store.cart().length).toBe(0);
  });
});
