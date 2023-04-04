import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError, Subscription } from "rxjs";
import { Spinkit } from 'ng-http-loader'
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { SendtoChartService } from 'src/app/send-tomychart-dialog/sendto-chart.service';
import { GetjsondataService } from 'src/app/getjsondata.service';

@Component({
  selector: 'app-new-assessment-email',
  templateUrl: './new-assessment-email.component.html',
  styleUrls: ['./new-assessment-email.component.css'],
  providers: [ConfirmationService, MessageService]
})

export class NewAssessmentEmailComponent implements OnInit, AfterViewInit, OnDestroy {
  matSelected = 'Admin Options';
  xhrError = '';
  headerPageTitle = 'New Assessment - Email';
  userDetailsUrl!: string;
  id!: number;
  result: any;
  resultError: any;
  spinkit = Spinkit;
  isValidData = true;

  descriptionOptions: string[] = [];
  selectedDescriptionId = '';

  raterOptions: string[] = [];
  selectedRaterTypeId = '';

  selectedAdminOption = '';
  adminOptions: string[] = [];

  selectedLanguage = '';
  langOptions: string[] = [];

  raterNameReadonly = false;
  shortURL: string[] = [];
  shotURLFieldReadonly = true;

  addRaterForm!: FormGroup;
  submitted = false;
  raterFormDeepCopy: string[] = [];
  addRaterButton = false;

  generateLinkButton = false;
  generateLinkBtnDisabled = false;
  sendToMyChartButtonDisabled = true;
  pageFreeZedCheck = false;

  checkActiveSubscription!: Subscription;

  deleteButtonDisabled = false;
  // value of this variable should come dynamically
  activeUserName: string = 'James Peterson';

  @ViewChild('myDialog') myDialog!: TemplateRef<any>;

  @ViewChild('tableTemplate') tableTemplate!: TemplateRef<any>;

  allSelected = false;
  @ViewChild('adminOption') adminOption!: MatSelect;

  constructor(private route: ActivatedRoute, private router: Router,
    private http: HttpClient, private formBuilder: FormBuilder, private dialog: MatDialog,
    private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig,
    private messageService: MessageService, private confirmationDialogService: ConfirmationDialogService,
    private dataService: GetjsondataService, private chartService: SendtoChartService) {
  }

  ngOnInit(): void {
    // if (localStorage.getItem('userinfoData') === null) {
    //   this.isValidData = false;
    //   let dialogTitle = 'Server Error!';
    //   let dialogMessage = `There is an error getting user information`;
    //   this.dataService.serverErrorDialog(dialogMessage, dialogTitle);
    // } else {
    this.primengConfig.ripple = true;
    this.setProductIdToStorage();
    this.setModeOfAssessmentToStorage();
    this.setShortNameToStorage();
    // handling add rater form data
    this.raterFormValues();
    // }
  }

  ngAfterViewInit() {

  }

  raterFormValues() {
    this.addRaterForm = this.formBuilder.group({
      description: ['', Validators.required],
      ratername: ['', Validators.required],
      ratertype: ['', Validators.required],
      adminOption: [''],
      language: ['', Validators.required]
    });
    this.addRaterForm.controls.adminOption.disable();
  }

  setProductIdToStorage() {
    if (sessionStorage.getItem("historyState_ProductId") === 'undefined') {
      sessionStorage.setItem('historyState_ProductId', history.state.id);
      console.log('undefined case: ', sessionStorage);
      this.getProductDetails(sessionStorage.getItem('historyState_ProductId'));
    }
    else if (history.state.id === undefined && sessionStorage.getItem("historyState_ProductId")) {
      // do nothing... page refresh case...
      this.getProductDetails(sessionStorage.getItem('historyState_ProductId'));
    }
    else {
      if (history.state.id && history.state.id == sessionStorage.getItem("historyState_ProductId")) {
        // do nothing... user clicked on same id
        this.getProductDetails(sessionStorage.getItem('historyState_ProductId'));
      } else {
        // user click on new id... setup new id
        sessionStorage.clear();
        sessionStorage.setItem('historyState_ProductId', history.state.id);
        this.getProductDetails(sessionStorage.getItem('historyState_ProductId'));
      }
    }
    // console.log('history-ID', history.state.id);
    // console.log('Final state-Id: ', sessionStorage.getItem('historyState_ProductId'));
  }

  setModeOfAssessmentToStorage() {
    if (history.state.ModeOfAssessment !== undefined)
      sessionStorage.setItem('historyState_ModeOfAssessment', history.state.ModeOfAssessment);
  }

  setShortNameToStorage() {
    if (history.state.shortName !== undefined)
      sessionStorage.setItem('historyState_shortName', history.state.shortName);
  }

  getDataFromDummyJson(id) {
    this.userDetailsUrl = 'https://dummyjson.com/users/' + id;
    this.getDataBasedOnId(this.userDetailsUrl);
  }

  getProductDetails(id) {
    let productDetailsURL = 'https://epicapi.portages.io/api/mhs/raterinfo/';
    let productDetailsURLNew = 'https://epicapi.portages.io/api/mhs/raterinfo/';
    this.userDetailsUrl = productDetailsURLNew + id;
    this.getDataBasedOnId(this.userDetailsUrl);
  }



  ngOnDestroy() {
    this.checkActiveSubscription.unsubscribe();
  }

  getDataBasedOnId(userDetailsUrl) {
    return this.checkActiveSubscription = this.http.get(userDetailsUrl).
      subscribe({
        next: (result) => {
          this.result = result;
          // console.log(result);
          this.populateDescriptionField(result['catalogues']);
          this.populateRaterTypeField(result['rater']);
          this.populateAdminOptionField(result['adminOpts']);
        },
        error: (error) => {
          if (error.status === 404 || error.status === 400) {
            this.redirectToPreviousComponent(error.message)
          }
          if (error.status === 503) {
            console.log('the server is not ready to handle the request');
          }
        },
      })
  }

  redirectToPreviousComponent(msg) {
    // console.log('redirectToPreviousComponent');
    this.resultError = msg;
    setTimeout(() => {
      this.router.navigate(['/NewAssesment'], { relativeTo: this.route });
    }, 4000)
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || 'server Error'));
  }

  get f() { return this.addRaterForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addRaterForm.invalid) {
      return;
    }
    this.addToList();
    this.generateLinkButton = true;
  }

  // Render Rater UI
  addToList() {
    let x = this.checkIfDuplicateExist(this.addRaterForm.value, this.raterFormDeepCopy);
    // console.log('duplicateCheck: ', x);
    console.log('form-Value', this.addRaterForm.value);

    if (this.raterFormDeepCopy.length === 0) {
      this.raterFormDeepCopy.push(this.addRaterForm.value);
    } else if (this.raterFormDeepCopy.length !== 0 && !x) {
      this.raterFormDeepCopy.push(this.addRaterForm.value);
    }
    else {
      this.openDialogWithTemplateRef(this.myDialog);
    }
    console.log('deepCopyFormObj-Final: ', this.raterFormDeepCopy);
  }

  // check if submitted form and dynamic UI array has same key value pairs to check duplicate entry
  checkIfDuplicateExist(formValueObj, deepCopyArr) {
    let ifexist = false;
    Object.keys(deepCopyArr).forEach((key, val) => {
      if (formValueObj.hasOwnProperty("adminOption")) {
        if (deepCopyArr[val]['description']['name'] === formValueObj['description']['name'] &&
          this.adminOptionDuplicateCheck(deepCopyArr[val]['adminOption'], formValueObj['adminOption']) &&
          deepCopyArr[val]['language']['name'] === formValueObj['language']['name'] &&
          deepCopyArr[val]['ratertype']['rater'] === formValueObj['ratertype']['rater'] &&
          deepCopyArr[val]['ratername'] === formValueObj['ratername']) {
          ifexist = true;
        }
      }
      else if (!formValueObj.hasOwnProperty("adminOption")) {
        if (deepCopyArr[val]['description']['name'] === formValueObj['description']['name'] &&
          deepCopyArr[val]['language']['name'] === formValueObj['language']['name'] &&
          deepCopyArr[val]['ratertype']['rater'] === formValueObj['ratertype']['rater'] &&
          deepCopyArr[val]['ratername'] === formValueObj['ratername']) {
          ifexist = true;
        }
      }
    });
    return ifexist;
  }

  adminOptionDuplicateCheck(deepCopyArr, formValueObj) {
    // as adminOption field is not mandatory, if there is no checkbox selected and entry is added it would considered duplicate entry as ususal
    let adminOptionCheck = false;
    if (formValueObj.length === 0) {
      adminOptionCheck = true;
    } else {
      if (formValueObj && formValueObj.length > 1) {
        Object.keys(deepCopyArr).forEach((key, val) => {
          if (deepCopyArr.length == formValueObj.length && deepCopyArr[key]['name'] === formValueObj[key]['name'])
            adminOptionCheck = true;
        });
      } else if (deepCopyArr.length == formValueObj.length && deepCopyArr[0]['name'] === formValueObj[0]['name']) {
        adminOptionCheck = true;
      }
    }
    return adminOptionCheck;
  }

  //select fields onchange value
  onSelectedDescription(event: MatSelectChange) {
    // console.log(event);
    // console.log(event.source.triggerValue);
    if (event.source.triggerValue == 'Conners 4') {
      this.addRaterForm.controls.adminOption.enable();
      this.adminOption.options.forEach((item: MatOption) => item.select());
    } else if (event.source.triggerValue !== 'Conners 4') {
      this.addRaterForm.controls.adminOption.disable();
      this.adminOption.options.forEach((item: MatOption) => item.deselect());
    }
    this.selectedDescriptionId = event.value.id;
  }

  onSelectedRaterType(e: any, value) {
    let selectRaterTypeText = e.target.options[e.target.options.selectedIndex].text;
    // if rater type if self report, set username to rater name field
    if (selectRaterTypeText == 'Self-Report') {
      let setUserNameToRaterName = JSON.parse(localStorage.userinfoData);
      setUserNameToRaterName = setUserNameToRaterName.PatientFName + ' ' + setUserNameToRaterName.PatientLName;
      this.addRaterForm.controls['ratername'].setValue(setUserNameToRaterName);
      this.raterNameReadonly = true;
    } else {
      this.addRaterForm.controls['ratername'].setValue('');
      this.raterNameReadonly = false;
    }

    this.selectedRaterTypeId = value[0];
    // let x = this.addRaterForm;
    let raterTypeId = sessionStorage.getItem('historyState_ProductId');
    let url = `https://epicapi.portages.io/api/MHS/raterlanguageinfo`;
    let urlNew = `https://epicapi.portages.io/api/MHS/raterlanguageinfo`;

    let requestParams = {
      "raterTypeId": Number(this.selectedRaterTypeId),
      "formTypeId": Number(this.selectedDescriptionId),
      "toolId": Number(raterTypeId)
    };
    // console.log('requestParams::', requestParams);

    this.http.post(urlNew, requestParams).subscribe({
      next: (obj) => {
        this.langOptions = [];
        Object.values(obj['languages']).map((NamedIndex: any) => {
          this.langOptions.push(NamedIndex);
        });
      },
      error: (error) => { console.log(error) }
    })
  }

  onSelectedAdminOption(value) {
    this.selectedAdminOption = value;
    // console.log('SelectedAdminOption: ', this.selectedAdminOption)
  }

  onSelectedLanguage(value) {
    this.selectedLanguage = value;
    // console.log('SelectedLanguage: ', this.selectedLanguage)
  }

  //render dynamic select fields option value
  populateDescriptionField(obj) {
    Object.keys(obj).map((NamedIndex) => {
      let dataIndex = obj[NamedIndex];
      this.descriptionOptions.push(dataIndex);
    });
  }

  populateRaterTypeField(obj) {
    Object.keys(obj).map((NamedIndex) => {
      let dataIndex = obj[NamedIndex];
      // console.log('dataIndex', dataIndex);
      this.raterOptions.push(dataIndex);
    });
  }

  populateAdminOptionField(obj) {
    Object.keys(obj).map((NamedIndex) => {
      let dataIndex = obj[NamedIndex];
      this.adminOptions.push(dataIndex);
    });
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  deleteConfirmation(index: number, e) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // if(this.raterFormDeepCopy.length === 1) {
        //   Object.keys(this.addRaterForm.controls).forEach(ctrl => {
        //     this.addRaterForm.controls[ctrl].enable();
        //   });
        //   this.addRaterButton = false;
        //   this.composeEmailButtonDisabled = true;
        // }
        this.raterFormDeepCopy.splice(index, 1);
        this.showToastBottomCenter();
        // console.log(this.raterFormDeepCopy);
      },
      reject: () => { }
    });
  }

  showToastBottomCenter() {
    this.messageService.add({ key: 'bc', severity: 'success', summary: 'success', detail: 'Record has been deleted!' });
  }

  generateLinkConfirmation() {
    this.confirmationService.confirm({
      message: `<div>
      <div class="MsgText pb-2">
            Please review the following. To make changes, click Cancel. To Continue click Generate Link
      </div>
      <div class="col1" *ngFor="let item of raterFormDeepCopy | keyvalue; let i = index">
        <div class="AddTile1">
            <div class="row">
              <div class="col">RATER NAME</div>
              <div class="col">FORM TYPE(S)</div>
            </div>
            <div class="row">
              <div class="col">
                <div class="border-bottom"></div>
              </div>
            </div>
            <div class="row">
              <div class="col pt-2">Conners 4 ADHD INDEX (English)</div>
              <div class="col pt-2">Self-Harm</div>
            </div>
        </div>
      </div>
      </div>`,
      header: 'Generate Link Confirmation',
      accept: () => {
        console.log('page is freezed');
      },
      reject: () => { }
    });
  }

  openConfirmationDialog() {
    this.confirmationDialogService.confirm('Generate Link! Please confirm..', this.raterFormDeepCopy)
      .then((confirmed) => {
        if (confirmed) {
          Object.keys(this.addRaterForm.controls).forEach(ctrl => {
            this.addRaterForm.controls[ctrl].disable();
          });
          this.addRaterButton = true;
          this.sendToMyChartButtonDisabled = false;
          this.deleteButtonDisabled = true;
          this.generateLinkBtnDisabled = true;
          this.addAssesment();
          this.addRaterForm.reset();
        }
      })
      .catch((err) => console.log('Error::', err));
  }

  addAssesment() {
    let urlNew = 'https://10.131.96.50:44332/api/MHS/addassessment';
    // let url = 'https://epicapi.portages.io/api/MHS/addassessment';
    this.http.post(urlNew, this.requestObjectForAddAssesment()).subscribe({
      next: (result: any) => {
        this.shortURL = result.responseData;
        console.log('addAssesment', result.responseData);
        localStorage.setItem('shortUrlData', JSON.stringify(result.responseData));
        sessionStorage.setItem('raterFormDeepCopy', JSON.stringify(this.raterFormDeepCopy));
      },
      error: (error) => { console.log(error) }
    })
  }

  requestObjectForAddAssesment() {
    let userInfo = JSON.parse(localStorage.getItem('userinfoData') || '');
    let addAssesment = [];
    let fhirId = {};
    fhirId['fhirId'] = userInfo['OrganizationName'];
    let patientInfo = {
      "firstName": userInfo['PatientFName'],
      "lastName": userInfo['PatientLName'],
      "email": userInfo['PatientEmail'],
      "gender": userInfo['PatientGender'],
      "birthDate": userInfo['PatientDOB'],
      "fhirId": userInfo['PatientId'],
      "age": this.calculateAge(userInfo['PatientDOB']),
      "isActive": true
    };

    let practitionerInfo = {
      "firstName": userInfo['PractitionerName'],
      "lastName": "",
      "email": userInfo['PractitionerEmail'],
      "fhirId": userInfo['PractitionerId'],
      "isActive": true
    }

    let assessmentInfoArray = [];
    Object.entries(this.raterFormDeepCopy).forEach(([key, val]) => {
      let assessmentInfo = {
        "raterName": val['ratername'],
        "raterTypeId": val['ratertype']['id'],
        "languageId": val['language']['id'],
        "toolId": Number(sessionStorage.getItem('historyState_ProductId')),
        "formTypeId": val['description']['id'],
        "shortName": this.createShortName(sessionStorage.getItem('historyState_shortName'), this.raterFormDeepCopy[key]),
        "ModeOfAssessment": Number(sessionStorage.getItem('historyState_ModeOfAssessment'))
      };
      assessmentInfoArray[key] = assessmentInfo;
    });

    addAssesment['clientInfo'] = this.sortObj(patientInfo);
    addAssesment['userInfo'] = this.sortObj(practitionerInfo)
    addAssesment['organizationInfo'] = fhirId;
    addAssesment['assessmentInfo'] = assessmentInfoArray;

    let finalAddAssessmentData = { ...addAssesment };
    console.log(finalAddAssessmentData);
    return finalAddAssessmentData;
  }

  createShortName(name, obj) {
    Object.entries(obj).forEach(([key, val]: any) => { })

    let finalShortName; let finalRater;
    let fname = name.replace(/\s/g, "");

    if (obj['ratertype']['rater'].includes("-")) {
      finalRater = obj['ratertype']['rater'].match(/\b(\w)/g).join('');
    } else {
      finalRater = obj['ratertype']['rater'].charAt(0);
    }

    if (obj.hasOwnProperty('adminOption')) {
      let adminOptionText;
      if (obj['adminOption'].length === 1 && obj['adminOption'][0]['name'] === 'DSM Conduct Disorder') {
        adminOptionText = '_' +'CD'
      } else if (obj['adminOption'].length === 1 && obj['adminOption'][0]['name'] === 'Self-Harm') {
        adminOptionText = '_' +'SLFHRM';
      } else if (obj['adminOption'].length === 2) {
        adminOptionText = '_' +'CD_SLFHRM';
      } else {
        adminOptionText = '';
      }
      finalShortName = fname + '_' + finalRater + adminOptionText;
      return finalShortName;
    } else {
      let descName; let finalDescName;
      if (obj['description']['name'].includes("–")) {
        descName = obj['description']['name'].split(/[–]/);
        if (descName[1] == 'ADHD Index') {
          finalDescName = descName[1].match(/\b(\w)/g).join('');
        } else {
          finalDescName = descName[1];
        }
      } else if (!obj['description']['name'].includes("–")) {
        descName = obj['description']['name'].replace(/\s/g, "").split(" ");
      }
      finalShortName = fname + '_' + finalRater + '_' + finalDescName;
      return finalShortName;
    }
  }

  sortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
  }

  calculateAge(value) {
    const dobDate = new Date(value);
    const today = new Date();
    const yearMilliseconds = 3.154e10;
    const ageMilliseconds = today.valueOf() - dobDate.valueOf();
    const ageYears = Math.floor(ageMilliseconds / yearMilliseconds);
    return ageYears;
  }

  goToComposeEmail() {
    this.dataService.passDataToComposeEmail(this.raterFormDeepCopy);
  }

  sentToMyChart() {
    this.chartService.confirm(
      'Assessment link generated for your rater. You Can view assessment link on your myChart App',
      'In case you want to receive Email link and Text message for the same please verify your email and phone number')
      .then((confirmed) => console.log('User confirmed:', confirmed))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}

