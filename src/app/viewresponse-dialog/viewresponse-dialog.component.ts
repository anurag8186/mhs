import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GetjsondataService } from '../getjsondata.service';

@Component({
  selector: 'app-viewresponse-dialog',
  templateUrl: './viewresponse-dialog.component.html',
  styleUrls: ['./viewresponse-dialog.component.css']
})
export class ViewresponseDialogComponent implements OnInit {

  @Input() title!: string;
  @Input() message!: string;
  @Input() btnOkText!: string;
  @Input() btnCancelText!: string;

  viewResponseData: any;

  constructor(private activeModal: NgbActiveModal, private getViewResponService: GetjsondataService) { 
    this.assessmentIdSetToStorage();
  }

  ngOnInit(): void {
    
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  assessmentIdSetToStorage() {
    if(history.state.assessmentId !== undefined) {
      localStorage.setItem('assessmentIdnumber', history.state.assessmentId);
      // New or reload case
      this.getViewResponse(localStorage.getItem('assessmentIdnumber'));
    }
    else {
      // undefined case
      this.getViewResponse(localStorage.getItem('assessmentIdnumber'));
    }
  }

  getViewResponse(assessmentId) {
    const data = this.getViewResponService.getViewResponseData(assessmentId).
      subscribe(
        {
          next: (data: any) => {
            console.log('getViewResponse-Data', data);
            this.viewResponseData = data.responseData.response;
          },
          error: (err: any) => {

          },
        }
      );
  }
}
