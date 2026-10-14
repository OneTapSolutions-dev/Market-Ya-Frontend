import { Component, inject } from '@angular/core';

import {
  ElectronicDocumentDraftInput,
} from '../../core/models/electronic-document.model';
import { ElectronicDocuments } from '../../core/services/electronic-documents';
import { Store } from '../../core/services/store';
import { ToastStore } from '../../core/services/toast-store';
import { ElectronicDocumentsList } from '../../ui/organisms/electronic-documents-list';

/**
 * Página: Emisión y Consulta de Comprobantes SUNAT (`electronic-documents-page`).
 */
@Component({
  selector: 'ui-electronic-documents-page',
  imports: [ElectronicDocumentsList],
  templateUrl: './electronic-documents-page.html',
})
export class ElectronicDocumentsPage {
  readonly documentsService = inject(ElectronicDocuments);
  readonly store = inject(Store);
  private readonly toastStore = inject(ToastStore);

  onDraftCreated(event: { input: ElectronicDocumentDraftInput; actor: string }): void {
    const created = this.documentsService.createDraft(event.input, event.actor);
    this.toastStore.success('Borrador Creado', `Se registró el borrador ${created.draftReference}.`);
  }

  onDraftUpdated(event: { id: string; input: ElectronicDocumentDraftInput; actor: string }): void {
    const updated = this.documentsService.updateDraft(event.id, event.input, event.actor);
    if (updated) {
      this.toastStore.success('Borrador Actualizado', `Se guardaron los cambios en ${updated.draftReference}.`);
    }
  }

  onDraftIssued(event: { id: string; actor: string }): void {
    const result = this.documentsService.emitDocument(event.id, event.actor);
    if (result) {
      this.toastStore.success('Comprobante Emitido', `El comprobante ${result.draftReference} fue emitido a SUNAT.`);
    }
  }

  onDraftVoided(event: { id: string; actor: string }): void {
    const result = this.documentsService.voidDocument(event.id, event.actor);
    if (result) {
      this.toastStore.warning('Comprobante Anulado', `Se emitió la comunicación de baja para ${result.draftReference}.`);
    }
  }
}
