import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateConfirmationDialogComponent } from './template-confirmation-dialog.component';
@Injectable({
  providedIn: 'root'
})

export class TemplateConfirmationService {

  showTemplateNameInput = false;

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Yes, Save As New',
    btnCancelText: string = 'Continue with Existing',
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(TemplateConfirmationDialogComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }

}
