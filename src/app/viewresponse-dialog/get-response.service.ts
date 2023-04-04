import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewresponseDialogComponent } from './viewresponse-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GetResponseService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message?: any,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ViewresponseDialogComponent, { size:dialogSize});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }
}
