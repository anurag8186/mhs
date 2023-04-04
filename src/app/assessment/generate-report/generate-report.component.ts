import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GetjsondataService } from 'src/app/getjsondata.service';
import { GetResponseService } from 'src/app/viewresponse-dialog/get-response.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Spinkit } from 'ng-http-loader';
import { of } from 'rxjs';
@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css']
})
export class GenerateReportComponent implements OnInit {
  public spinkit = Spinkit;
  isValidData = true;
  headerPageTitle = 'Generate Report';
  result: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  reportOptionData: any;
  ScoreOption: any;
  withinprofilecomparison: any;
  ConfidenceInterval: any;
  principalreference: any;
  additionalreference: any;
  Object = Object;
  generateReportForm!: FormGroup;
  assessmentId: any;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private getViewResponService: GetResponseService, public dialog: MatDialog, private _snackBar: MatSnackBar, private customerService: GetjsondataService) {
    this.generateReportForm = this.fb.group({
      scoreOptionCheckBoxArray: this.fb.array([], [Validators.required]),
      scoreOptionRadioButtonArray: ["", [Validators.required]],
      reportOptionCheckBoxArray: this.fb.array([], [Validators.required]),
    });

  }
 
  ngOnInit(): void {
    this.assessmentId = history.state.id;
    // if (localStorage.getItem('userinfoData') === null) {
    //   this.isValidData = false;
    //   let dialogTitle = 'Server Error!';
    //   let dialogMessage = `There is an error getting user information`;
    //   this.dataService.serverErrorDialog(dialogMessage, dialogTitle);
    // }
    this.getGenerateReportOption();
  }
 
  getGenerateReportOption() {
    let catalogId = sessionStorage.getItem('historyState_ProductId');
    const data = this.customerService.getGenerateReportOptionData(catalogId).
      subscribe(
        {
          next: (data: any) => {
            console.log('GenerateReportOption', data);
            this.reportOptionData = data.responseData.reportformat.reportoption;
            this.ScoreOption = data.responseData.reportformat.ScoreOption;
            // console.log('ScoreOption:: ', this.ScoreOption);              
          },
          error: (err: any) => {
            let dialogTitle = 'Server Error!';
            // if backDropDisable is true, modal dialog does not close on outside onClick 
            let backDropDisable = true;
            // if actionButton is true, actionable button appears on modal dialog 
            let actionButton = false;
            let dialogMessage = `There is an error fetching record with Catalog ID`;
            this.customerService.serverErrorDialog(dialogMessage, dialogTitle, backDropDisable, actionButton);
          },
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['redNoMatch']
    });
  }

  onCheckboxChange(data, e: any) {
    const scoreOptionArray: FormArray = this.generateReportForm.get('scoreOptionCheckBoxArray') as FormArray;
    if (e.target.checked) {
      scoreOptionArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      scoreOptionArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          scoreOptionArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    // console.log('value::=> ', scoreOptionArray)
    // console.log('label::=> ', data.tag)
  }

  reportOptionCheckBoxChange(data, e: any) {
    const reportOptionCheckBoxArray: FormArray = this.generateReportForm.get('reportOptionCheckBoxArray') as FormArray;
    if (e.target.checked) {
      reportOptionCheckBoxArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      reportOptionCheckBoxArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          reportOptionCheckBoxArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.log('Report option value::=> ', reportOptionCheckBoxArray)
    // console.log('label::=> ', data.tag)
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.generateReportForm.valid) {
      return false;
    } else {
      let x = confirm('Are you sure, you want to submit record?');
      if(x)
      console.log(this.generateReportForm.value);
    }
  }

  openConfirmationDialog() {
    this.getViewResponService.confirm('Response Review')
    .then((confirmed) => console.log('User confirmed:', confirmed))
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  } 
}

