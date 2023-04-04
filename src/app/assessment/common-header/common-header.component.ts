import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetjsondataService } from 'src/app/getjsondata.service';
import { ConfirmDialogModel, ServerErrorDialogComponent } from 'src/app/server-error-dialog/server-error-dialog.component';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.css']
})
export class CommonHeaderComponent implements OnInit, AfterViewInit {
  @Input() headerPageTitle: any;
  currentUser: any;
  currentUserAge: any;
  jsonParseError: string = '';
  result: string = '';

  constructor(public dialog: MatDialog, private customerService: GetjsondataService) { };

  ngOnInit(): void {
    // try {
    //   this.currentUser = JSON.parse(localStorage.getItem('userinfoData') || '{}');
    //   this.currentUserAge = this.calculateAge(this.currentUser.PatientDOB);
    // } catch (e) {
    //   console.log(this.jsonParseError);
    //   this.jsonParseError = e; // error in the above string (in this case, yes)!
    //   let dialogTitle = 'Server Error!';
    //   this.serverErrorDialog(e, dialogTitle);
    // }
    // this.currentUser = JSON.parse(localStorage.getItem('userinfoData') || '{}');
    // this.currentUserAge = this.calculateAge(this.currentUser.PatientDOB);

    if (localStorage.getItem('userinfoData') !== null) {
      this.currentUser = JSON.parse(localStorage.getItem('userinfoData') || '{}');
      this.currentUserAge = this.calculateAge(this.currentUser.PatientDOB);
    } else {
      // this.jsonParseError = e; // error in the above string (in this case, yes)!
      let dialogTitle = 'Server Error!';
      // this.serverErrorDialog('There is error getting user info', dialogTitle);
      let backDropDisable = true;
      // if actionButton is true, actionable button appears on modal dialog 
      let actionButton = false;
      let dialogMessage = `There is an error fetching user info`;
      this.customerService.serverErrorDialog(dialogMessage, dialogTitle, backDropDisable, actionButton);
    }

  }

  ngAfterViewInit() {

  }

  calculateAge(value) {
    const dobDate = new Date(value);
    const today = new Date();
    const yearMilliseconds = 3.154e10;
    const ageMilliseconds = today.valueOf() - dobDate.valueOf();
    const ageYears = Math.floor(ageMilliseconds / yearMilliseconds);
    return ageYears;
  }

  // serverErrorDialog(dialogMessage, dialogTitle): void {
  //   const dialogData = new ConfirmDialogModel(dialogTitle, dialogMessage, true);
  //   const dialogRef = this.dialog.open(ServerErrorDialogComponent, {
  //     maxWidth: "400px",
  //     data: dialogData,
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     this.result = dialogResult;
  //   });
  // }

}
