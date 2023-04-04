import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonDialogComponent, ConfirmDialogModel } from '../shared/common-dialog/common-dialog.component';
import { GetjsondataService } from '../getjsondata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-tomychart-dialog',
  templateUrl: './send-tomychart-dialog.component.html',
  styleUrls: ['./send-tomychart-dialog.component.css']
})
export class SendTomychartDialogComponent implements OnInit {

  result: string = '';
  @Input() title!: string;
  @Input() message!: string;
  @Input() btnOkText!: string;
  @Input() btnCancelText!: string;

  @ViewChild('myDialog') myDialog!: TemplateRef<any>;
  form!: FormGroup;
  numberOfAssessment: any;
  shortUrlData: any;
  userInfoData: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private activeModal: NgbActiveModal, private dialog: MatDialog, private commonService: GetjsondataService) { }

  ngOnInit(): void {
    this.getAssessmentShortUrlData();
    this.getUserInfoData();
    this.form = this.formBuilder.group({
      email: ['test@gmail.com', [Validators.required, Validators.email]],
      phone: ['+91992438845', Validators.required],
    });
  }

  getAssessmentShortUrlData() {
    this.shortUrlData = JSON.parse(localStorage.getItem('shortUrlData') || '{}');
    console.log('shortUrlData', this.shortUrlData);
  }

  getUserInfoData() {
    this.userInfoData = JSON.parse(localStorage.getItem('userinfoData') || '{}');
    console.log('userInfoData', this.userInfoData);
  }

  public decline() {
    this.activeModal.close(false);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  public accept() {
    if (!this.form.valid) {
      return false;
    } else {
      console.log(this.form.value);
      this.activeModal.close(false);
      this.emailConfirmationPopup(this.form.value);
    }
    // this.activeModal.close(false);
    // this.emailConfirmationPopup();
    // this.openDialogWithTemplateRef(this.myDialog);
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  emailConfirmationPopup(formValue) {
    const data = this.commonService.sendmyChartEmail().subscribe(
      (data: any) => {
        this.openDialogWithTemplateRef(this.myDialog);
        // this.confirmDialog();
      }
    );
  }

  confirmDialog(): void {
    const message = `The link has been sent to myChart App.`;

    const dialogData = new ConfirmDialogModel("Success", message);

    const dialogRef = this.dialog.open(CommonDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

  redirectToAssessmentHistory() {
    this.router.navigate(['assesmentHistory']);
  }

}
