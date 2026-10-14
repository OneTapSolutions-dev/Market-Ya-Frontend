export interface Product {
  id: string;
  barcode: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  name: string;
  presentation: string;
  packaging: string;
  costPrice: number;
  salePrice: number;
  stockAlmacen: number;
  stockGondola: number;
  minGondola: number;
  maxGondola?: number;
  unitsPerBox: number;
  expirationDate: string;
  entryDate: string;
  supplierInvoiceDate: string;
  supplier: string;
  exchangeDaysLimit: number;
  isPack?: boolean;
  packComponents?: PackComponent[];
  status: 'NORMAL' | 'STOCK_BAJO' | 'ALERTA_VENCIMIENTO' | 'VENCIDO';
}

export interface PackComponent {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  unitSalePrice: number;
  unitOfMeasure?: string;
}

export interface ProductsResponse {
  totalProducts: number;
  categories: string[];
  subcategories: string[];
  brands: string[];
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  displayName?: string;
  tier?: 'UNIDAD' | 'PACK' | 'CAJA';
  unitsPerItem?: number;
}

export interface StockTransfer {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  sku: string;
  quantityMoved: number;
  requestedBy: string;
  notes: string;
}
