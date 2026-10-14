export const ELECTRONIC_DOCUMENT_TYPES = [
  { type: 'FACTURA', label: 'Factura electrónica' },
  { type: 'BOLETA', label: 'Boleta de venta electrónica' },
  { type: 'NOTA_CREDITO', label: 'Nota de crédito electrónica' },
  { type: 'NOTA_DEBITO', label: 'Nota de débito electrónica' },
] as const;

export type ElectronicDocumentType = (typeof ELECTRONIC_DOCUMENT_TYPES)[number]['type'];
export type ElectronicDocumentStatus =
  | 'BORRADOR'
  | 'PENDIENTE_INTEGRACION'
  | 'ENVIANDO'
  | 'ACEPTADO'
  | 'RECHAZADO'
  | 'ANULADO'
  | 'ERROR_EMISION';
export type ElectronicDocumentAction = 'CREADO' | 'EDITADO' | 'CONSULTADO';

export interface ElectronicDocumentCustomer {
  identityType: 'RUC' | 'DNI' | 'OTRO';
  identityNumber: string;
  name: string;
  address: string;
}

export interface ElectronicDocumentLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface ElectronicDocumentBase {
  id: string;
  draftReference: string;
  status: ElectronicDocumentStatus;
  issueDate: string;
  customer: ElectronicDocumentCustomer;
  lines: ElectronicDocumentLine[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  audit: ElectronicDocumentAuditEntry[];
}

export interface InvoiceDraft extends ElectronicDocumentBase {
  type: 'FACTURA';
}

export interface ReceiptDraft extends ElectronicDocumentBase {
  type: 'BOLETA';
}

export interface CreditNoteDraft extends ElectronicDocumentBase {
  type: 'NOTA_CREDITO';
  relatedDocumentReference: string;
}

export interface DebitNoteDraft extends ElectronicDocumentBase {
  type: 'NOTA_DEBITO';
  relatedDocumentReference: string;
}

export type ElectronicDocumentDraft =
  | InvoiceDraft
  | ReceiptDraft
  | CreditNoteDraft
  | DebitNoteDraft;

interface ElectronicDocumentDraftInputBase {
  issueDate: string;
  customer: ElectronicDocumentCustomer;
  lines: ElectronicDocumentLine[];
}

export type ElectronicDocumentDraftInput =
  | (ElectronicDocumentDraftInputBase & { type: 'FACTURA' | 'BOLETA' })
  | (ElectronicDocumentDraftInputBase & {
      type: 'NOTA_CREDITO' | 'NOTA_DEBITO';
      relatedDocumentReference: string;
    });

export interface ElectronicDocumentAuditEntry {
  id: string;
  action: ElectronicDocumentAction;
  actor: string;
  occurredAt: string;
  detail: string;
}
