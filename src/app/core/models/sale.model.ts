import { CartItem } from './product.model';

export type DocumentType = 'BOLETA' | 'FACTURA' | 'NOTA_VENTA';
export type PaymentMethod = 'EFECTIVO' | 'YAPE' | 'PLIN' | 'TARJETA' | 'YAPE_PLIN';

export interface CustomerInfo {
  docType: 'DNI' | 'RUC' | 'VARIO';
  docNumber: string;
  name: string;
  address?: string;
}

export interface SaleTransaction {
  id: string;
  receiptNumber: string; // e.g. B001-0004821
  dateTime: string;
  documentType: DocumentType;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  igv: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeAmount: number;
  cashierName: string;
  sunatStatus: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
  sunatQrCode?: string;
  sunatHashCode?: string;
  transactionCode?: string;
  paymentAccountName?: string;
}

export interface CashShift {
  id: string;
  shiftNumber: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingBalance: number;
  expectedCash: number;
  expectedYape: number;
  expectedPlin: number;
  expectedCard: number;
  actualCash?: number;
  discrepancy?: number;
  status: 'ABIERTA' | 'CERRADA' | 'REABIERTA';
  reopenReason?: string;
  reopenedBy?: string;
  reopenedAt?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  suggestedSalePrice: number;
  unitType?: 'UNIDAD' | 'PAQUETE' | 'CAJA';
  unitsPerPackage?: number;
  batchDate?: string;
  expirationDate?: string;
  minStock?: number;
  maxStock?: number;
}

export interface PurchaseRecord {
  id: string;
  invoiceNumber: string;
  invoiceDate?: string;
  supplierName: string;
  dateTime: string;
  items: PurchaseItem[];
  totalCost: number;
  paymentType: string;
  receivedBy: string;
  status: 'INGRESO_ALMACEN' | 'CANCELADO';
}

export interface UnifiedMovement {
  id: string;
  type: 'VENTA' | 'COMPRA' | 'TRASLADO' | 'CANJE';
  title: string;
  documentRef: string;
  partyName: string;
  dateTime: string;
  totalAmount: number;
  itemsCount: number;
  status: string;
  rawDetails: any;
}
