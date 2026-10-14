import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ELECTRONIC_DOCUMENT_TYPES,
  ElectronicDocumentDraft,
  ElectronicDocumentDraftInput,
  ElectronicDocumentType,
} from '../../../core/models/electronic-document.model';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Modal } from '../../molecules/modal';
import { SearchBar } from '../../molecules/search-bar';

interface DraftFormState {
  type: ElectronicDocumentType;
  issueDate: string;
  identityType: 'RUC' | 'DNI' | 'OTRO';
  identityNumber: string;
  customerName: string;
  customerAddress: string;
  relatedDocumentReference: string;
  lines: Array<{ description: string; quantity: number; unitPrice: number }>;
}

/**
 * Organismo: Gestión de borradores y comprobantes electrónicos SUNAT (`ui-electronic-documents-list`).
 */
@Component({
  selector: 'ui-electronic-documents-list',
  imports: [DecimalPipe, FormsModule, Button, Icon, Modal, SearchBar],
  templateUrl: './electronic-documents-list.html',
})
export class ElectronicDocumentsList {
  readonly documents = input.required<ElectronicDocumentDraft[]>();
  readonly actor = input<string>('Administrador');

  readonly draftCreated = output<{ input: ElectronicDocumentDraftInput; actor: string }>();
  readonly draftUpdated = output<{ id: string; input: ElectronicDocumentDraftInput; actor: string }>();
  readonly draftIssued = output<{ id: string; actor: string }>();
  readonly draftVoided = output<{ id: string; actor: string }>();

  readonly documentTypes = ELECTRONIC_DOCUMENT_TYPES;

  // Filtros
  readonly searchTerm = signal('');
  readonly typeFilter = signal<ElectronicDocumentType | 'TODOS'>('TODOS');
  readonly statusFilter = signal('TODOS');

  // Formulario Modal
  readonly formVisible = signal(false);
  readonly editingDocumentId = signal<string | null>(null);
  readonly formError = signal('');

  draftForm: DraftFormState = this.initForm();

  // Modal Detalle
  readonly selectedDoc = signal<ElectronicDocumentDraft | null>(null);
  readonly detailModalOpen = signal(false);

  readonly filteredDocuments = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const type = this.typeFilter();
    const status = this.statusFilter();

    return this.documents()
      .filter((doc) => type === 'TODOS' || doc.type === type)
      .filter((doc) => status === 'TODOS' || doc.status === status)
      .filter((doc) => {
        if (!query) return true;
        const relatedRef = 'relatedDocumentReference' in doc ? doc.relatedDocumentReference : '';
        return (
          doc.draftReference.toLowerCase().includes(query) ||
          doc.customer.name.toLowerCase().includes(query) ||
          doc.customer.identityNumber.toLowerCase().includes(query) ||
          relatedRef.toLowerCase().includes(query) ||
          doc.lines.some((l) => l.description.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  });

  readonly formLinesTotal = computed(() => {
    return this.draftForm.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  });

  documentTypeLabel(type: ElectronicDocumentType): string {
    return this.documentTypes.find((opt) => opt.type === type)?.label ?? type;
  }

  getDocumentTotal(doc: ElectronicDocumentDraft): number {
    return doc.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }

  openNewDraft(type: ElectronicDocumentType = 'FACTURA'): void {
    this.editingDocumentId.set(null);
    this.formError.set('');
    this.draftForm = this.initForm(type);
    this.formVisible.set(true);
  }

  editDraft(doc: ElectronicDocumentDraft): void {
    if (doc.status !== 'BORRADOR') return;
    this.editingDocumentId.set(doc.id);
    this.formError.set('');
    this.draftForm = {
      type: doc.type,
      issueDate: doc.issueDate,
      identityType: doc.customer.identityType,
      identityNumber: doc.customer.identityNumber,
      customerName: doc.customer.name,
      customerAddress: doc.customer.address,
      relatedDocumentReference: 'relatedDocumentReference' in doc ? doc.relatedDocumentReference : '',
      lines: doc.lines.map((l) => ({ ...l })),
    };
    this.formVisible.set(true);
  }

  addLine(): void {
    this.draftForm.lines = [...this.draftForm.lines, { description: '', quantity: 1, unitPrice: 0 }];
  }

  removeLine(index: number): void {
    this.draftForm.lines = this.draftForm.lines.filter((_, i) => i !== index);
  }

  saveDraft(): void {
    const invalidLine = this.draftForm.lines.some(
      (line) => !line.description.trim() || line.quantity <= 0 || line.unitPrice < 0,
    );
    if (
      !this.draftForm.issueDate ||
      !this.draftForm.identityNumber.trim() ||
      !this.draftForm.customerName.trim() ||
      this.draftForm.lines.length === 0 ||
      invalidLine
    ) {
      this.formError.set(
        'Completa la fecha, documento y nombre del cliente, y al menos una línea válida con descripción, cantidad > 0 y precio >= 0.',
      );
      return;
    }

    const inputData: ElectronicDocumentDraftInput =
      this.draftForm.type === 'NOTA_CREDITO' || this.draftForm.type === 'NOTA_DEBITO'
        ? {
            type: this.draftForm.type,
            issueDate: this.draftForm.issueDate,
            relatedDocumentReference: this.draftForm.relatedDocumentReference.trim(),
            customer: {
              identityType: this.draftForm.identityType,
              identityNumber: this.draftForm.identityNumber.trim(),
              name: this.draftForm.customerName.trim(),
              address: this.draftForm.customerAddress.trim(),
            },
            lines: this.draftForm.lines.map((l) => ({ ...l, description: l.description.trim() })),
          }
        : {
            type: this.draftForm.type,
            issueDate: this.draftForm.issueDate,
            customer: {
              identityType: this.draftForm.identityType,
              identityNumber: this.draftForm.identityNumber.trim(),
              name: this.draftForm.customerName.trim(),
              address: this.draftForm.customerAddress.trim(),
            },
            lines: this.draftForm.lines.map((l) => ({ ...l, description: l.description.trim() })),
          };

    const id = this.editingDocumentId();
    if (id) {
      this.draftUpdated.emit({ id, input: inputData, actor: this.actor() });
    } else {
      this.draftCreated.emit({ input: inputData, actor: this.actor() });
    }

    this.formVisible.set(false);
  }

  emitDocument(doc: ElectronicDocumentDraft): void {
    this.draftIssued.emit({ id: doc.id, actor: this.actor() });
  }

  voidDocument(doc: ElectronicDocumentDraft): void {
    this.draftVoided.emit({ id: doc.id, actor: this.actor() });
  }

  openDetail(doc: ElectronicDocumentDraft): void {
    this.selectedDoc.set(doc);
    this.detailModalOpen.set(true);
  }

  private initForm(type: ElectronicDocumentType = 'FACTURA'): DraftFormState {
    return {
      type,
      issueDate: new Date().toISOString().split('T')[0],
      identityType: type === 'FACTURA' ? 'RUC' : 'DNI',
      identityNumber: '',
      customerName: '',
      customerAddress: '',
      relatedDocumentReference: '',
      lines: [{ description: '', quantity: 1, unitPrice: 0 }],
    };
  }
}
