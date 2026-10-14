import { computed, inject, Service, signal } from '@angular/core';

import { CartItem, Product, ProductsResponse, StockTransfer } from '../models/product.model';
import {
  CashShift,
  CustomerInfo,
  DocumentType,
  PaymentMethod,
  PurchaseRecord,
  SaleTransaction,
  UnifiedMovement,
} from '../models/sale.model';
import { ToastStore } from './toast-store';

export interface UserSession {
  username: string;
  name: string;
  role: 'admin' | 'cajero';
  avatar: string;
}

export interface AppNotification {
  id: string;
  type: 'transfer' | 'expiration' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkRoute: string;
}

export interface SupplierPolicy {
  id: string;
  name: string;
  ruc?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  hasPolicy: boolean;
  daysLimit: number;
  badgeColor: string;
  description: string;
}

/**
 * Store central de la aplicación (`Store`).
 * - Gestiona el estado de sesión, catálogo de productos, carrito de ventas, transferencias de stock,
 *   turnos de caja, compras a proveedores y notificaciones.
 */
@Service()
export class Store {
  private readonly toastStore = inject(ToastStore);

  // Sesión y navegación
  readonly currentUser = signal<UserSession | null>({
    username: 'admin1',
    name: 'Administrador 1',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });
  readonly isDarkMode = signal<boolean>(false);

  private readonly modulesByRole: Record<UserSession['role'], readonly string[]> = {
    admin: [
      'dashboard',
      'pos',
      'inventory',
      'expirations',
      'movements',
      'cash-closure',
      'electronic-documents',
      'units',
      'packs',
    ],
    cajero: ['pos', 'cash-closure'],
  };

  // Catálogo de Productos
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly subcategories = signal<string[]>([]);
  readonly brands = signal<string[]>([]);
  readonly isLoadingProducts = signal<boolean>(true);

  // Políticas de Proveedores
  readonly supplierPolicies = signal<SupplierPolicy[]>([
    {
      id: 'SUP-1',
      name: 'Arca Continental Lindley',
      hasPolicy: true,
      daysLimit: 30,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      description: 'Canje directo 100% garantizado hasta 30 días antes de expiración en gaseosas y aguas.',
    },
    {
      id: 'SUP-2',
      name: 'Leche Gloria S.A.',
      hasPolicy: true,
      daysLimit: 30,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Canjes en derivados lácteos y yogures con nota de crédito o reemplazo de lote fresco.',
    },
    {
      id: 'SUP-3',
      name: 'Alicorp S.A.A.',
      hasPolicy: true,
      daysLimit: 15,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Liquidación asistida en góndola con descuento comercial preferencial o canje directo.',
    },
  ]);

  // Kardex y Traslados
  readonly stockTransfers = signal<StockTransfer[]>([]);

  // POS y Carrito
  readonly cart = signal<CartItem[]>([]);
  readonly salesHistory = signal<SaleTransaction[]>([]);

  // Compras (Entradas)
  readonly purchasesHistory = signal<PurchaseRecord[]>([]);

  // Turnos de Caja
  readonly currentShift = signal<CashShift>({
    id: 'SHIFT-20261002-01',
    shiftNumber: 'CAJA-01 (#1042)',
    cashierName: 'Cajero 1',
    openedAt: '2026-10-02T08:00:00',
    openingBalance: 200.0,
    expectedCash: 1450.5,
    expectedYape: 980.0,
    expectedPlin: 0,
    expectedCard: 1120.0,
    status: 'ABIERTA',
  });

  readonly closedShiftHistory = signal<CashShift[]>([
    {
      id: 'SHIFT-20260929-01',
      shiftNumber: 'CAJA-01 (#1039)',
      cashierName: 'Cajero 1',
      openedAt: '2026-09-29T08:00:00',
      closedAt: '2026-09-29T16:00:00',
      openingBalance: 200.0,
      expectedCash: 1240.5,
      expectedYape: 640.0,
      expectedPlin: 285.0,
      expectedCard: 510.0,
      actualCash: 1240.5,
      discrepancy: 0,
      status: 'CERRADA',
    },
    {
      id: 'SHIFT-20260930-01',
      shiftNumber: 'CAJA-01 (#1040)',
      cashierName: 'Cajero 2',
      openedAt: '2026-09-30T08:00:00',
      closedAt: '2026-09-30T16:05:00',
      openingBalance: 200.0,
      expectedCash: 980.0,
      expectedYape: 720.0,
      expectedPlin: 310.0,
      expectedCard: 845.0,
      actualCash: 965.0,
      discrepancy: -15.0,
      status: 'CERRADA',
    },
    {
      id: 'SHIFT-20261001-01',
      shiftNumber: 'CAJA-01 (#1041)',
      cashierName: 'Administrador 1',
      openedAt: '2026-10-01T08:00:00',
      closedAt: '2026-10-01T16:10:00',
      openingBalance: 200.0,
      expectedCash: 1525.75,
      expectedYape: 890.0,
      expectedPlin: 420.0,
      expectedCard: 760.0,
      actualCash: 1540.75,
      discrepancy: 15.0,
      status: 'CERRADA',
    },
  ]);

  // Notificaciones
  readonly appNotifications = signal<AppNotification[]>([]);

  readonly unreadNotificationsCount = computed(() => {
    return this.appNotifications().filter((n) => !n.read).length;
  });

  // Métricas Computadas
  readonly totalSalesToday = computed(() => {
    return this.salesHistory().reduce((acc, sale) => acc + sale.total, 0) + 3550.5;
  });

  readonly totalTransactionsToday = computed(() => {
    return this.salesHistory().length + 42;
  });

  readonly totalPurchasesMonth = computed(() => {
    return this.purchasesHistory().reduce((acc, pur) => acc + pur.totalCost, 0);
  });

  readonly lowStockGondolaCount = computed(() => {
    return this.products().filter((p) => p.stockGondola <= p.minGondola).length;
  });

  readonly nearExpirationCount = computed(() => {
    const today = new Date();
    return this.products().filter((p) => {
      const exp = new Date(p.expirationDate);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 30 && diffDays >= 0;
    }).length;
  });

  readonly allMovements = computed<UnifiedMovement[]>(() => {
    const moves: UnifiedMovement[] = [];

    this.purchasesHistory().forEach((p) => {
      moves.push({
        id: p.id,
        type: 'COMPRA',
        title: `Compra Proveedor: ${p.supplierName}`,
        documentRef: p.invoiceNumber,
        partyName: p.supplierName,
        dateTime: p.dateTime,
        totalAmount: p.totalCost,
        itemsCount: p.items.reduce((sum, item) => sum + item.quantity, 0),
        status: p.status === 'INGRESO_ALMACEN' ? 'ENTRADA ALMACÉN' : 'CANCELADO',
        rawDetails: p,
      });
    });

    this.salesHistory().forEach((s) => {
      moves.push({
        id: s.id,
        type: 'VENTA',
        title: `Venta ${s.documentType}: ${s.receiptNumber}`,
        documentRef: s.receiptNumber,
        partyName: s.customer.name || 'CLIENTE VARIOS',
        dateTime: s.dateTime,
        totalAmount: s.total,
        itemsCount: s.items.reduce((sum, item) => sum + item.quantity, 0),
        status: s.sunatStatus,
        rawDetails: s,
      });
    });

    return moves.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  });

  constructor() {
    this.loadProducts();
    this.loadInitialMockData();
  }

  async loadProducts(): Promise<void> {
    this.isLoadingProducts.set(true);
    try {
      const origin = typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null'
        ? window.location.origin
        : 'http://localhost';
      const res = await fetch(`${origin}/products_data.json`);
      if (!res.ok) throw new Error('Failed to load products');
      const data: ProductsResponse = await res.json();
      this.products.set(data.products);
      this.categories.set(data.categories);
      this.subcategories.set(data.subcategories);
      this.brands.set(data.brands);
    } catch (err) {
      if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null' && !window.location.origin.includes('localhost')) {
        console.error('Error cargando products_data.json:', err);
      }
      this.toastStore.error('Error de Carga', 'No se pudieron cargar los productos desde la base de datos.');
    } finally {
      this.isLoadingProducts.set(false);
    }
  }

  private loadInitialMockData(): void {
    this.stockTransfers.set([
      {
        id: 'TRF-0098',
        timestamp: '2026-10-03 09:15',
        productId: 'BEB-001',
        productName: 'San Luis Sin Gas 625 ml',
        sku: 'BEB-001',
        quantityMoved: 24,
        requestedBy: 'Cajero 1',
        notes: 'Reposición matutina de Góndola principal',
      },
      {
        id: 'TRF-0099',
        timestamp: '2026-10-03 11:30',
        productId: 'BEB-016',
        productName: 'Monster Energy Mango Loco 473 ml',
        sku: 'BEB-016',
        quantityMoved: 12,
        requestedBy: 'Administrador 1',
        notes: 'Mercadería agotada en exhibidor',
      },
    ]);

    this.purchasesHistory.set([
      {
        id: 'PUR-2026-001',
        invoiceNumber: 'F001-8842',
        supplierName: 'Arca Continental Lindley S.A.',
        dateTime: '2026-10-01T10:30:00',
        totalCost: 1850.0,
        paymentType: 'CREDITO_30_DIAS',
        receivedBy: 'Administrador 1',
        status: 'INGRESO_ALMACEN',
        items: [
          {
            productId: 'BEB-001',
            productName: 'San Luis Sin Gas 625 ml',
            sku: 'BEB-001',
            category: 'Bebidas',
            quantity: 120,
            unitCost: 1.2,
            totalCost: 144.0,
            suggestedSalePrice: 2.5,
          },
          {
            productId: 'BEB-016',
            productName: 'Monster Energy Mango Loco 473 ml',
            sku: 'BEB-016',
            category: 'Bebidas',
            quantity: 144,
            unitCost: 5.5,
            totalCost: 792.0,
            suggestedSalePrice: 8.5,
          },
          {
            productId: 'BEB-020',
            productName: 'Inca Kola Sin Azúcar 500 ml',
            sku: 'BEB-020',
            category: 'Bebidas',
            quantity: 240,
            unitCost: 2.1,
            totalCost: 504.0,
            suggestedSalePrice: 3.5,
          },
        ],
      },
      {
        id: 'PUR-2026-002',
        invoiceNumber: 'F003-9120',
        supplierName: 'Leche Gloria S.A.',
        dateTime: '2026-10-02T14:15:00',
        totalCost: 2420.5,
        paymentType: 'CONTADO_EFECTIVO',
        receivedBy: 'Administrador 1',
        status: 'INGRESO_ALMACEN',
        items: [
          {
            productId: 'LAC-001',
            productName: 'Leche Evaporada Gloria Azul 400g',
            sku: 'LAC-001',
            category: 'Lácteos y Huevos',
            quantity: 480,
            unitCost: 3.4,
            totalCost: 1632.0,
            suggestedSalePrice: 4.5,
          },
          {
            productId: 'LAC-005',
            productName: 'Yogurt Batimix Fresa 125g',
            sku: 'LAC-005',
            category: 'Lácteos y Huevos',
            quantity: 180,
            unitCost: 2.1,
            totalCost: 378.0,
            suggestedSalePrice: 3.0,
          },
        ],
      },
      {
        id: 'PUR-2026-003',
        invoiceNumber: 'F012-0044',
        supplierName: 'Alicorp S.A.A.',
        dateTime: '2026-10-03T08:45:00',
        totalCost: 3100.0,
        paymentType: 'CREDITO_30_DIAS',
        receivedBy: 'Cajero 1',
        status: 'INGRESO_ALMACEN',
        items: [
          {
            productId: 'ABAR-001',
            productName: 'Aceite Primor Clásico 1L',
            sku: 'ABAR-001',
            category: 'Abarrotes',
            quantity: 240,
            unitCost: 8.5,
            totalCost: 2040.0,
            suggestedSalePrice: 11.5,
          },
          {
            productId: 'ABAR-010',
            productName: 'Fideos Don Vittorio Spaghetti 500g',
            sku: 'ABAR-010',
            category: 'Abarrotes',
            quantity: 300,
            unitCost: 2.2,
            totalCost: 660.0,
            suggestedSalePrice: 3.2,
          },
        ],
      },
    ]);

    this.salesHistory.set([
      {
        id: 'TX-1001',
        receiptNumber: 'B001-0004821',
        dateTime: '2026-10-03T11:20:00',
        documentType: 'BOLETA',
        customer: { docType: 'DNI', docNumber: '47891234', name: 'CLIENTE VARIOS' },
        items: [
          {
            product: {
              id: 'BEB-001',
              name: 'San Luis Sin Gas 625 ml',
              sku: 'BEB-001',
              presentation: '625 ml',
              packaging: 'Botella',
              costPrice: 1.5,
              salePrice: 2.5,
              stockAlmacen: 50,
              stockGondola: 20,
              minGondola: 5,
              unitsPerBox: 24,
              expirationDate: '2026-12-01',
              entryDate: '2026-09-01',
              category: 'Bebidas',
              subcategory: 'Aguas',
              brand: 'San Luis',
              barcode: '77512345678',
              supplier: 'Arca Continental',
              exchangeDaysLimit: 30,
              status: 'NORMAL',
              supplierInvoiceDate: '2026-09-01',
            },
            quantity: 2,
            unitPrice: 2.5,
            subtotal: 5.0,
          },
          {
            product: {
              id: 'ABAR-001',
              name: 'Aceite Primor Clásico 1L',
              sku: 'ABAR-001',
              presentation: '1 L',
              packaging: 'Botella',
              costPrice: 8.5,
              salePrice: 11.5,
              stockAlmacen: 80,
              stockGondola: 15,
              minGondola: 4,
              unitsPerBox: 12,
              expirationDate: '2027-01-01',
              entryDate: '2026-09-01',
              category: 'Abarrotes',
              subcategory: 'Aceites',
              brand: 'Primor',
              barcode: '77598765432',
              supplier: 'Alicorp',
              exchangeDaysLimit: 15,
              status: 'NORMAL',
              supplierInvoiceDate: '2026-09-01',
            },
            quantity: 1,
            unitPrice: 11.5,
            subtotal: 11.5,
          },
        ],
        subtotal: 13.98,
        igv: 2.52,
        total: 16.5,
        paymentMethod: 'EFECTIVO',
        amountPaid: 20.0,
        changeAmount: 3.5,
        cashierName: 'Cajero 1',
        sunatStatus: 'ACEPTADO',
        sunatHashCode: 'Hash-A8B9C0D1=',
      },
      {
        id: 'TX-1002',
        receiptNumber: 'F001-0001092',
        dateTime: '2026-10-03T12:05:00',
        documentType: 'FACTURA',
        customer: { docType: 'RUC', docNumber: '20601234567', name: 'SERVICIOS GENERALES LIMA S.A.C.' },
        items: [
          {
            product: {
              id: 'LAC-001',
              name: 'Leche Evaporada Gloria Azul 400g',
              sku: 'LAC-001',
              presentation: '400 g',
              packaging: 'Lata',
              costPrice: 3.4,
              salePrice: 4.5,
              stockAlmacen: 120,
              stockGondola: 30,
              minGondola: 10,
              unitsPerBox: 48,
              expirationDate: '2026-11-15',
              entryDate: '2026-09-01',
              category: 'Lácteos',
              subcategory: 'Leches',
              brand: 'Gloria',
              barcode: '77511112222',
              supplier: 'Leche Gloria',
              exchangeDaysLimit: 30,
              status: 'NORMAL',
              supplierInvoiceDate: '2026-09-01',
            },
            quantity: 24,
            unitPrice: 4.5,
            subtotal: 108.0,
          },
        ],
        subtotal: 91.53,
        igv: 16.47,
        total: 108.0,
        paymentMethod: 'YAPE_PLIN',
        amountPaid: 108.0,
        changeAmount: 0.0,
        cashierName: 'Administrador 1',
        sunatStatus: 'ACEPTADO',
        sunatHashCode: 'Hash-F9E8D7C6=',
      },
    ]);

    this.appNotifications.set([
      {
        id: 'NOTIF-01',
        type: 'transfer',
        title: 'Traslado Pendiente',
        message: 'Solicitud de reposición en Góndola: Gaseosas y Bebidas (24 unidades).',
        timestamp: new Date().toISOString(),
        read: false,
        linkRoute: '/inventory',
      },
      {
        id: 'NOTIF-02',
        type: 'expiration',
        title: 'Alerta Crítica de Vencimiento',
        message: 'Lote de Yogur Gloria Vainilla vence en 7 días. Por favor, verificar y aplicar descuento o canje.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        linkRoute: '/expirations',
      },
      {
        id: 'NOTIF-03',
        type: 'transfer',
        title: 'Nuevo Ingreso de Mercadería',
        message: 'Se han ingresado 3 cajas de Arca Continental Lindley en Almacén General.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        linkRoute: '/movements',
      },
      {
        id: 'NOTIF-04',
        type: 'system',
        title: 'Cierre de Caja Sugerido',
        message: 'Recordatorio: Se acerca la hora de cambio de turno. Sugerimos preparar el arqueo.',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        read: true,
        linkRoute: '/cash-closure',
      },
    ]);
  }

  canAccess(route: string): boolean {
    const role = this.currentUser()?.role;
    if (!role) return false;
    return this.modulesByRole[role].includes(route);
  }

  login(username: string, role: 'admin' | 'cajero'): void {
    const user: UserSession = {
      username,
      name: role === 'admin' ? 'Administrador 1' : 'Cajero 1',
      role,
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    };
    this.currentUser.set(user);
    this.toastStore.success('Sesión Iniciada', `Bienvenido al sistema MarketYa, ${user.name}`);
  }

  logout(): void {
    this.currentUser.set(null);
    this.toastStore.info('Sesión Finalizada', 'Has salido del sistema de manera segura.');
  }

  // Doble Kardex: Traslado de Almacén a Góndola
  transferStock(productId: string, quantity: number, notes: string): boolean {
    const prods = [...this.products()];
    const idx = prods.findIndex((p) => p.id === productId);
    if (idx === -1) return false;

    const prod = prods[idx];
    if (prod.stockAlmacen < quantity) {
      this.toastStore.warning('Stock Insuficiente', `Almacén solo cuenta con ${prod.stockAlmacen} unidades.`);
      return false;
    }

    const updatedProd: Product = {
      ...prod,
      stockAlmacen: prod.stockAlmacen - quantity,
      stockGondola: prod.stockGondola + quantity,
      status: prod.stockGondola + quantity > prod.minGondola ? 'NORMAL' : 'STOCK_BAJO',
    };
    prods[idx] = updatedProd;
    this.products.set(prods);

    const transferRecord: StockTransfer = {
      id: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }),
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      quantityMoved: quantity,
      requestedBy: this.currentUser()?.name || 'Sistema',
      notes: notes || 'Transferencia directa de almacén a góndola',
    };

    this.stockTransfers.update((trans) => [transferRecord, ...trans]);
    this.toastStore.success('Transferencia Exitosa', `Se trasladaron ${quantity} und. de "${prod.name}" a Góndola.`);
    return true;
  }

  // Carrito de Ventas (POS)
  addToCart(
    product: Product,
    quantity = 1,
    customUnitPrice?: number,
    displayName?: string,
    tier: 'UNIDAD' | 'PACK' | 'CAJA' = 'UNIDAD',
    unitsPerItem = 1,
  ): void {
    if (product.stockGondola <= 0) {
      this.toastStore.warning('Sin Stock en Góndola', `"${product.name}" no tiene stock en exhibición. Requiere traslado.`);
      return;
    }

    const totalUnitsNeeded = quantity * unitsPerItem;
    if (totalUnitsNeeded > product.stockGondola) {
      this.toastStore.warning(
        'Stock Insuficiente',
        `Se requieren ${totalUnitsNeeded} und., pero solo hay ${product.stockGondola} und. disponibles en góndola.`,
      );
      return;
    }

    const currentCart = [...this.cart()];
    const priceToUse = customUnitPrice !== undefined ? customUnitPrice : product.salePrice;
    const nameToUse = displayName || product.name;

    const existingIndex = currentCart.findIndex(
      (item) => item.product.id === product.id && (item.tier || 'UNIDAD') === tier,
    );

    if (existingIndex > -1) {
      const existingItem = currentCart[existingIndex];
      const newQty = existingItem.quantity + quantity;
      const totalUnits = newQty * (existingItem.unitsPerItem || 1);

      if (totalUnits > product.stockGondola) {
        this.toastStore.warning('Límite de Góndola', `Stock máximo disponible en góndola: ${product.stockGondola} und.`);
        return;
      }
      currentCart[existingIndex].quantity = newQty;
      currentCart[existingIndex].subtotal = newQty * existingItem.unitPrice;
    } else {
      currentCart.push({
        product,
        quantity,
        unitPrice: priceToUse,
        subtotal: priceToUse * quantity,
        displayName: nameToUse,
        tier,
        unitsPerItem,
      });
    }

    this.cart.set(currentCart);
  }

  updateCartQuantity(productId: string, delta: number, tier?: 'UNIDAD' | 'PACK' | 'CAJA'): void {
    const currentCart = [...this.cart()];
    const index = currentCart.findIndex((item) => item.product.id === productId && (!tier || item.tier === tier));
    if (index === -1) return;

    const item = currentCart[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      currentCart.splice(index, 1);
    } else {
      const totalUnitsNeeded = newQty * (item.unitsPerItem || 1);
      if (totalUnitsNeeded > item.product.stockGondola) {
        this.toastStore.warning('Límite de Góndola', `Stock máximo en góndola: ${item.product.stockGondola} unidades.`);
        return;
      }
      currentCart[index].quantity = newQty;
      currentCart[index].subtotal = newQty * item.unitPrice;
    }

    this.cart.set(currentCart);
  }

  removeFromCart(productId: string, tier?: 'UNIDAD' | 'PACK' | 'CAJA'): void {
    this.cart.update((items) => items.filter((i) => !(i.product.id === productId && (!tier || i.tier === tier))));
  }

  clearCart(): void {
    this.cart.set([]);
  }

  processSale(
    documentType: DocumentType,
    customer: CustomerInfo,
    paymentMethod: PaymentMethod,
    amountPaid: number,
    transactionCode?: string,
    paymentAccountName?: string,
  ): SaleTransaction | null {
    const items = [...this.cart()];
    if (items.length === 0) {
      this.toastStore.error('Carrito Vacío', 'Agregue productos antes de procesar la venta.');
      return null;
    }

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const subtotalNoIgv = total / 1.18;
    const igv = total - subtotalNoIgv;
    const change = Math.max(0, amountPaid - total);

    const receiptSeries = documentType === 'BOLETA' ? 'B001' : documentType === 'FACTURA' ? 'F001' : 'NV01';
    const receiptNum = Math.floor(100000 + Math.random() * 900000);
    const receiptString = `${receiptSeries}-${receiptNum}`;

    // Descontar unidades físicas de Góndola
    const prods = [...this.products()];
    items.forEach((item) => {
      const idx = prods.findIndex((p) => p.id === item.product.id);
      if (idx !== -1) {
        const unitsDeducted = item.quantity * (item.unitsPerItem || 1);
        prods[idx].stockGondola = Math.max(0, prods[idx].stockGondola - unitsDeducted);
        if (prods[idx].stockGondola <= prods[idx].minGondola) {
          prods[idx].status = 'STOCK_BAJO';
        }
      }
    });
    this.products.set(prods);

    const transaction: SaleTransaction = {
      id: `TX-${Date.now()}`,
      receiptNumber: receiptString,
      dateTime: new Date().toISOString(),
      documentType,
      customer,
      items,
      subtotal: subtotalNoIgv,
      igv,
      total,
      paymentMethod,
      amountPaid,
      changeAmount: change,
      cashierName: this.currentUser()?.name || 'Cajero Vendedor',
      sunatStatus: 'ACEPTADO',
      sunatQrCode: `20601234567|${documentType === 'FACTURA' ? '01' : '03'}|${receiptSeries}|${receiptNum}|${igv.toFixed(2)}|${total.toFixed(2)}|${new Date().toISOString().split('T')[0]}|${customer.docType}|${customer.docNumber}|`,
      sunatHashCode: `Hash-${Math.random().toString(36).substring(2, 10).toUpperCase()}=`,
      transactionCode,
      paymentAccountName,
    };

    this.salesHistory.update((list) => [transaction, ...list]);

    // Actualizar flujo del turno de caja
    if (paymentMethod === 'EFECTIVO') {
      this.currentShift.update((s) => ({ ...s, expectedCash: s.expectedCash + total }));
    } else if (paymentMethod === 'YAPE' || paymentMethod === 'YAPE_PLIN') {
      this.currentShift.update((s) => ({ ...s, expectedYape: s.expectedYape + total }));
    } else if (paymentMethod === 'PLIN') {
      this.currentShift.update((s) => ({ ...s, expectedPlin: s.expectedPlin + total }));
    } else {
      this.currentShift.update((s) => ({ ...s, expectedCard: s.expectedCard + total }));
    }

    this.clearCart();
    this.toastStore.success('Venta Emitida', `${documentType} ${receiptString} registrada con éxito.`);
    return transaction;
  }

  closeShift(actualCash: number): void {
    const shift = this.currentShift();
    const discrepancy = actualCash - shift.expectedCash;

    const closedShift: CashShift = {
      ...shift,
      closedAt: new Date().toISOString(),
      actualCash,
      discrepancy,
      status: 'CERRADA',
    };
    this.currentShift.set(closedShift);
    this.closedShiftHistory.update((history) => [closedShift, ...history.filter((i) => i.id !== closedShift.id)]);

    if (discrepancy === 0) {
      this.toastStore.success('Cierre de Caja Exitoso', 'La caja cerró perfectamente cuadrada.');
    } else {
      this.toastStore.warning('Caja Descuadrada', `Diferencia detectada: S/ ${discrepancy.toFixed(2)}`);
    }
  }

  reopenShift(reason: string): void {
    const shift = this.currentShift();
    const reopenedShift: CashShift = {
      ...shift,
      status: 'REABIERTA',
      reopenReason: reason,
      reopenedBy: this.currentUser()?.name || 'Administrador',
      reopenedAt: new Date().toISOString(),
    };
    this.currentShift.set(reopenedShift);
    this.closedShiftHistory.update((history) =>
      history.map((item) => (item.id === reopenedShift.id ? reopenedShift : item)),
    );

    this.toastStore.info('Caja Reabierta', 'Se habilitó la caja para correcciones de ventas bajo auditoría.');
  }

  addProduct(newProduct: Product): void {
    this.products.update((list) => [newProduct, ...list]);
    if (newProduct.category && !this.categories().includes(newProduct.category)) {
      this.categories.update((cats) => [...cats, newProduct.category]);
    }
    if (newProduct.brand && !this.brands().includes(newProduct.brand)) {
      this.brands.update((b) => [...b, newProduct.brand]);
    }
    this.toastStore.success('Producto Registrado', `"${newProduct.name}" fue agregado al catálogo.`);
  }

  addPurchaseRecord(purchase: PurchaseRecord): void {
    this.purchasesHistory.update((list) => [purchase, ...list]);

    const prods = [...this.products()];
    purchase.items.forEach((item) => {
      const idx = prods.findIndex(
        (p) => p.id === item.productId || p.sku.toLowerCase() === item.sku.toLowerCase(),
      );
      if (idx !== -1) {
        prods[idx] = {
          ...prods[idx],
          stockAlmacen: prods[idx].stockAlmacen + item.quantity,
          costPrice: item.unitCost,
          salePrice: item.suggestedSalePrice > 0 ? item.suggestedSalePrice : prods[idx].salePrice,
          minGondola: item.minStock || prods[idx].minGondola,
          maxGondola: item.maxStock || prods[idx].maxGondola,
          expirationDate: item.expirationDate || prods[idx].expirationDate,
          entryDate: item.batchDate || purchase.invoiceDate || prods[idx].entryDate,
          supplierInvoiceDate: purchase.invoiceDate || prods[idx].supplierInvoiceDate,
        };
      }
    });
    this.products.set(prods);

    this.toastStore.success(
      'Compra Registrada',
      `Factura ${purchase.invoiceNumber} con ${purchase.items.length} ítems registrada en Almacén.`,
    );
  }

  updateProductPrice(productId: string, newSalePrice: number): boolean {
    const prods = [...this.products()];
    const idx = prods.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      prods[idx] = { ...prods[idx], salePrice: Number(newSalePrice.toFixed(2)) };
      this.products.set(prods);
      return true;
    }
    return false;
  }

  addSupplierPolicy(policy: SupplierPolicy): void {
    this.supplierPolicies.update((list) => [...list, policy]);
    this.toastStore.success('Proveedor Registrado', `Se guardaron las políticas para ${policy.name}.`);
  }

  markNotificationAsRead(id: string): void {
    this.appNotifications.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  markAllNotificationsAsRead(): void {
    this.appNotifications.update((list) => list.map((n) => ({ ...n, read: true })));
  }
}
