import { computed, Service, signal } from '@angular/core';

import {
  CreditNoteDraft,
  DebitNoteDraft,
  ElectronicDocumentAction,
  ElectronicDocumentAuditEntry,
  ElectronicDocumentDraft,
  ElectronicDocumentDraftInput,
  InvoiceDraft,
  ReceiptDraft,
} from '../models/electronic-document.model';

@Service()
export class ElectronicDocuments {
  readonly documents = signal<ElectronicDocumentDraft[]>([
    {
      id: 'LOCAL-000001',
      type: 'FACTURA',
      draftReference: 'F001-0001201',
      status: 'ACEPTADO',
      issueDate: '2026-10-01',
      customer: {
        identityType: 'RUC',
        identityNumber: '20601234567',
        name: 'Corporación Inka Food S.A.C.',
        address: 'Av. Industrial 450, Lima',
      },
      lines: [
        { description: 'Aceite Primor Clásico 1L (Caja x 12)', quantity: 10, unitPrice: 105.0 },
        { description: 'Arroz Costeño Extra 5kg (Fardo x 6)', quantity: 5, unitPrice: 120.0 },
      ],
      createdAt: '2026-10-01T10:00:00Z',
      updatedAt: '2026-10-01T10:05:00Z',
      createdBy: 'Administrador 1',
      audit: [
        {
          id: 'AUDIT-000001',
          action: 'CREADO',
          actor: 'Administrador 1',
          occurredAt: '2026-10-01T10:00:00Z',
          detail: 'Comprobante emitido y validado ante SUNAT.',
        },
      ],
    },
    {
      id: 'LOCAL-000002',
      type: 'BOLETA',
      draftReference: 'B001-0004822',
      status: 'BORRADOR',
      issueDate: '2026-10-03',
      customer: {
        identityType: 'DNI',
        identityNumber: '47891234',
        name: 'Juan Alberto Mendoza',
        address: 'Jr. Los Álamos 240, Surco',
      },
      lines: [
        { description: 'San Luis Sin Gas 625 ml', quantity: 4, unitPrice: 2.5 },
        { description: 'Galletas Casino Menta 6pk', quantity: 2, unitPrice: 4.8 },
      ],
      createdAt: '2026-10-03T14:20:00Z',
      updatedAt: '2026-10-03T14:20:00Z',
      createdBy: 'Cajero 1',
      audit: [
        {
          id: 'AUDIT-000002',
          action: 'CREADO',
          actor: 'Cajero 1',
          occurredAt: '2026-10-03T14:20:00Z',
          detail: 'Borrador creado localmente.',
        },
      ],
    },
  ]);

  readonly drafts = computed(() => this.documents().filter((doc) => doc.status === 'BORRADOR'));

  private nextDraftNumber = 3;
  private nextAuditNumber = 3;

  createDraft(input: ElectronicDocumentDraftInput, actor: string): ElectronicDocumentDraft {
    const timestamp = new Date().toISOString();
    const id = `LOCAL-${String(this.nextDraftNumber++).padStart(6, '0')}`;
    const audit = [this.createAudit('CREADO', actor, timestamp, 'Borrador creado localmente.')];
    const common = {
      id,
      draftReference: `BORRADOR-${String(this.nextDraftNumber - 1).padStart(6, '0')}`,
      status: 'BORRADOR' as const,
      issueDate: input.issueDate,
      customer: { ...input.customer },
      lines: input.lines.map((line) => ({ ...line })),
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actor,
      audit,
    };

    let document: ElectronicDocumentDraft;
    switch (input.type) {
      case 'FACTURA':
        document = { ...common, type: 'FACTURA' } satisfies InvoiceDraft;
        break;
      case 'BOLETA':
        document = { ...common, type: 'BOLETA' } satisfies ReceiptDraft;
        break;
      case 'NOTA_CREDITO':
        document = {
          ...common,
          type: 'NOTA_CREDITO',
          relatedDocumentReference: input.relatedDocumentReference,
        } satisfies CreditNoteDraft;
        break;
      case 'NOTA_DEBITO':
        document = {
          ...common,
          type: 'NOTA_DEBITO',
          relatedDocumentReference: input.relatedDocumentReference,
        } satisfies DebitNoteDraft;
        break;
    }

    this.documents.update((docs) => [document, ...docs]);
    return document;
  }

  updateDraft(
    id: string,
    input: ElectronicDocumentDraftInput,
    actor: string,
  ): ElectronicDocumentDraft | undefined {
    const existing = this.documents().find((doc) => doc.id === id);
    if (!existing || existing.status !== 'BORRADOR' || existing.type !== input.type) return undefined;

    const timestamp = new Date().toISOString();
    const audit = this.createAudit('EDITADO', actor, timestamp, 'Borrador editado.');
    let updated: ElectronicDocumentDraft;

    const common = {
      ...existing,
      issueDate: input.issueDate,
      customer: { ...input.customer },
      lines: input.lines.map((l) => ({ ...l })),
      updatedAt: timestamp,
      audit: [...existing.audit, audit],
    };

    if (existing.type === 'NOTA_CREDITO' || existing.type === 'NOTA_DEBITO') {
      const relRef = 'relatedDocumentReference' in input ? input.relatedDocumentReference : '';
      updated = { ...common, type: existing.type, relatedDocumentReference: relRef } as ElectronicDocumentDraft;
    } else {
      updated = { ...common, type: existing.type } as ElectronicDocumentDraft;
    }

    this.documents.update((docs) => docs.map((doc) => (doc.id === id ? updated : doc)));
    return updated;
  }

  emitDocument(id: string, actor: string): ElectronicDocumentDraft | undefined {
    const existing = this.documents().find((doc) => doc.id === id);
    if (!existing || existing.status !== 'BORRADOR') return undefined;

    const timestamp = new Date().toISOString();
    const prefix = existing.type === 'FACTURA' ? 'F001' : existing.type === 'BOLETA' ? 'B001' : 'FC01';
    const num = Math.floor(100000 + Math.random() * 900000);
    const formalRef = `${prefix}-${num}`;

    const audit = this.createAudit('CONSULTADO', actor, timestamp, `Comprobante ${formalRef} emitido a SUNAT.`);
    const updated: ElectronicDocumentDraft = {
      ...existing,
      draftReference: formalRef,
      status: 'ACEPTADO',
      updatedAt: timestamp,
      audit: [...existing.audit, audit],
    };

    this.documents.update((docs) => docs.map((doc) => (doc.id === id ? updated : doc)));
    return updated;
  }

  voidDocument(id: string, actor: string): ElectronicDocumentDraft | undefined {
    const existing = this.documents().find((doc) => doc.id === id);
    if (!existing || existing.status !== 'ACEPTADO') return undefined;

    const timestamp = new Date().toISOString();
    const audit = this.createAudit('CONSULTADO', actor, timestamp, 'Comprobante dado de baja / anulado ante SUNAT.');
    const updated: ElectronicDocumentDraft = {
      ...existing,
      status: 'ANULADO',
      updatedAt: timestamp,
      audit: [...existing.audit, audit],
    };

    this.documents.update((docs) => docs.map((doc) => (doc.id === id ? updated : doc)));
    return updated;
  }

  recordConsultation(id: string, actor: string): void {
    const timestamp = new Date().toISOString();
    const audit = this.createAudit('CONSULTADO', actor, timestamp, 'Borrador consultado.');
    this.documents.update((docs) =>
      docs.map((doc) => (doc.id === id ? { ...doc, updatedAt: timestamp, audit: [...doc.audit, audit] } : doc)),
    );
  }

  private createAudit(
    action: ElectronicDocumentAction,
    actor: string,
    occurredAt: string,
    detail: string,
  ): ElectronicDocumentAuditEntry {
    return {
      id: `AUDIT-${String(this.nextAuditNumber++).padStart(6, '0')}`,
      action,
      actor,
      occurredAt,
      detail,
    };
  }
}
