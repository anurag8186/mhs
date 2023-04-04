import { AfterViewInit, Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PreviewEmailService } from 'src/app/preview-email/preview-email.service';
import { GetjsondataService } from 'src/app/getjsondata.service';
import { HttpClient } from '@angular/common/http';
import { Spinkit } from 'ng-http-loader';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ComposeEmailComponent implements OnInit, AfterViewInit {

  spinkit = Spinkit;
  currentValue: any;
  assessmentData: string[] = [];
  selfReportPatientEmail: any;
  isReadonly = false;
  headerPageTitle = 'Compose Email';
  composeEmailForm!: FormGroup;
  submitted = false;
  public selectedPatient: any = [];
  clientEmail = new FormControl();
  @ViewChild('clientName') usernameElement: ElementRef;
  myusername: string = "";
  clientNameData = '';
  getTemplateDataUrl = 'https://epicapi.portages.io/api/EmailTemplate/gettemplates/';
  sendEmailUrl = 'https://epicapi.portages.io/api/EmailTemplate/sendEmail/';
  templateResult: string[] = [];
  templateSubject: string[] = [];
  templateBody: string[] = [];
  practionerId: any = '';
  sendEmailButtonClicked = false;

  constructor(private route: ActivatedRoute, private router: Router, usernameElement: ElementRef, private confirmationService: ConfirmationService, private messageService: MessageService, private http: HttpClient, private ref: ChangeDetectorRef, private formBuilder: FormBuilder, private previewEmail: PreviewEmailService, private dataService: GetjsondataService) {
    this.usernameElement = usernameElement;
  }

  ngAfterViewInit() { }
  ngOnInit(): void {
    if(sessionStorage.getItem('raterFormDeepCopy') === null)
      this.redirectToPreviousComponent();
      
    this.getDefaultTemplateData();
    // this.validateForm();
    this.selfReportPatientEmail = JSON.parse(localStorage.getItem('userinfoData') || '').PatientEmail;
    this.assessmentData = JSON.parse(sessionStorage.getItem('raterFormDeepCopy') || '');

    // getting value using behaviour subject
    // this.dataService.currentMessage.subscribe(currentData => { this.currentValue = currentData; });
    // console.log(this.currentValue);

    // const formDataObj = {};
    // for (const prop of Object.keys(this.assessmentData)) {
    //   formDataObj[prop] = new FormControl(this.assessmentData[prop]);
    //   this.personProps.push(prop);
    // }
    // this.composeEmailForm = new FormGroup(formDataObj);
    // console.log(this.composeEmailForm);

    this.composeEmailForm = this.formBuilder.group({});

    Object.entries(this.assessmentData).forEach(([key, val]) => {
      this.selectedPatient[key] = val['ratername'];
      let pEmail = 'test@gmail.com';
      if (val['ratertype']['rater'] == 'Self-Report') {
        pEmail = this.selfReportPatientEmail;
      }
      this.composeEmailForm.addControl(val['ratername'], new FormControl(val['ratername'], Validators.required))
      this.composeEmailForm.addControl(val['ratertype']['rater'], new FormControl(pEmail, [Validators.required, this.emailValidatorForFormField]))

    })
    // console.log(this.composeEmailForm.value);
  }

 

  validateForm() {
    this.composeEmailForm = this.formBuilder.group({
      // clientName: ['', [Validators.required]],
      // clientEmail: ['', [Validators.required]],
    });
  }

  public emailDialog() {
    sessionStorage.setItem('composeFormEmail', JSON.stringify(this.composeEmailForm.value));
    this.sendEmailButtonClicked = false;
    this.clientNameData = this.usernameElement.nativeElement.value;
    // console.log('it does nothing', this.clientNameData);
    if (this.onSubmit()) {
      // console.log('submitted form value::', this.composeEmailForm.value);
      this.previewEmail.confirm('Generate Link! Please confirm..', 'test')
        .then((confirmed) => console.log())
        .catch(() => console.log('User dismissed the dialog compose email page'));
    }
  }

  get f() { console.log(this.composeEmailForm.controls); return this.composeEmailForm.controls; }

  onSubmit() {
    if (!this.composeEmailForm.valid) {
      this.composeEmailForm.markAllAsTouched();
      return false;
    } else {
      return true;
    }
  }

  getError(formControlName: string, validatorName: string): string {
    return this.determineErroMessage(formControlName, validatorName);
  }

  private determineErroMessage(
    formControlName: string,
    validatorName: string
  ): string {
    switch (formControlName) {
      case 'email':
        return 'You must enter a valid email';
      default:
        return 'You must enter a valid email';
    }
  }

  sendEmailFromComposeEmailPage() {
    this.sendEmailButtonClicked = true;
    const composeFormData = structuredClone(this.composeEmailForm.value);
    
    let sendEmailObj: any = {
      toEmail: [],
      assessmentId: [],
      subject: this.templateSubject,
      body: this.templateBody,
      fhirId: this.practionerId
    };

    for (const [key, value] of Object.entries(composeFormData)) {
      if (this.validateEmail(value) !== undefined) {
        sendEmailObj.toEmail.push(this.validateEmail(value));
      }
    }

    Object.entries(JSON.parse(localStorage.getItem('shortUrlData') || '')).forEach(
      ([key, value]: any) => sendEmailObj.assessmentId.push(value.assessmentId)
    );
    this.sendEmail(sendEmailObj);
  }

  sendEmail(requestObj){
    this.http.post(this.sendEmailUrl, requestObj).
    subscribe({
      next: (result: any) => {
        console.log('send email success :: -> ',result);
        this.showToastBottomCenter(result.status, result.message);
      },
      error: (error) => {
        console.log('send email error', error);
      },
    })
  }

  getDefaultTemplateData(){
    let pid = JSON.parse(localStorage.getItem('userinfoData') || "");
    this.practionerId = pid['PractitionerId'];

    this.http.get(this.getTemplateDataUrl + this.practionerId).
    subscribe({
      next: (result: any) => {
        // console.log('template Data :: -> ',result.responseData);
        this.templateResult = result.responseData;
        // assigning 0 index to templateResult array as template named "Default" which is at 0 index should be show bydefault
        this.templateSubject = this.templateResult[0]['emailSubject'];
        this.templateBody = this.templateResult[0]['emailBody'];
      },
      error: (error) => {
        if (error.status === 404 || error.status === 400) {
          console.log(error.message)
        }
        if (error.status === 503) {
          console.log('the server is not ready to handle the request');
        }
      },
    })
  }

  emailconfirmationDialog(){
    if(this.onSubmit()){
      this.confirmationService.confirm({
        message: 'Do you want to continue...?',
        header: 'Send Email Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sendEmailFromComposeEmailPage();
        },
        reject: () => { }
      });
    }
  }

  showToastBottomCenter(summary, detail) {
    this.messageService.add({ key: 'bc', severity: 'success', summary: summary, detail: detail });
  }

  emailValidatorForFormField(control) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

  validateEmail(email) {
    return (email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )?.input;
  }

  redirectToPreviousComponent() {
    // console.log('redirectToPreviousComponent');
    setTimeout(() => {
      this.router.navigate(['/NewAssesment'], { relativeTo: this.route });
    }, 4000)
  }

}
