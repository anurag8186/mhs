import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpClient } from '@angular/common/http';
import { Spinkit } from 'ng-http-loader'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplateConfirmationService } from '../template-confirmation-dialog/template-confirmation.service';

@Component({
  selector: 'app-preview-email',
  templateUrl: './preview-email.component.html',
  styleUrls: ['./preview-email.component.css']
})
export class PreviewEmailComponent implements OnInit {

  @Input() title!: string;
  @Input() message: any;
  @Input() btnOkText!: string;
  @Input() btnCancelText!: string;

  saveTemplateForm!: FormGroup;
  submitted = false;
  editor = ClassicEditor;
  ckEditorData: any = `<p>Hello, world!</p>`;
  spinkit = Spinkit;
  practionerId: any = '';
  selectedTemplateNameText: String = '';
  templateName!: '';
  templateResult: string[] = [];
  templateData: string[] = [];
  templateSubject: String = '';
  templateErrorMessage: String = '';
  templateErrorStatus = false;
  addTemplateServerResponse = '';
  clearTime: any = '';

  saveNewTemplateInput = false;
  defaultTemplateInput = true;

  sendEmailFlag = false;
  emailIsInProgress = false;
  emailSuccess = false;
  emailResponse = '';

  getTemplatesUrl = 'https://epicapi.portages.io/api/EmailTemplate/gettemplates/';
  getTemplateDataUrl = 'https://epicapi.portages.io/api/EmailTemplate/gettemplate/';
  addTemplateUrl = 'https://epicapi.portages.io/api/EmailTemplate/addtemplate';
  sendEmailUrl = 'https://epicapi.portages.io/api/EmailTemplate/sendemail';

  constructor(private templateConfirmationDialog: TemplateConfirmationService, private activeModal: NgbActiveModal, private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // get user/practioned Id
    let pid = JSON.parse(localStorage.getItem('userinfoData') || "");
    this.practionerId = pid['PractitionerId'];
    this.getTemplate();

    this.saveTemplateForm = this.formBuilder.group({
      subject: ['', Validators.required],
      EmailBody: ['', Validators.required],
    });
  }

  getTemplate() {
    // this.practionerId = 1; // passing 1 temporarly. once build is ready actual practionerId should go from line 28
    this.http.get(this.getTemplatesUrl + this.practionerId).
      subscribe({
        next: (result: any) => {
          this.templateResult = result.responseData;
          // assigning 0 index to templateResult array as template named "Default" which is at 0 index should be show bydefault
          this.templateSubject = this.templateResult[0]['emailSubject'];
          this.ckEditorData = this.templateResult[0]['emailBody'];
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

  onSelectedTemplateName(e: any, value) {
    this.addTemplateServerResponse = '';
    this.selectedTemplateNameText = e.target.options[e.target.options.selectedIndex].text;
    // console.log(this.selectedTemplateNameText);
    this.http.get(this.getTemplateDataUrl + this.practionerId + '/' + this.selectedTemplateNameText).
      subscribe({
        next: (result: any) => {
          if (result === null) {
            this.templateErrorMessage = 'Error: Empty response from server';
            this.templateErrorStatus = true;
          } else {
            this.templateErrorMessage = '';
            this.templateErrorStatus = false;
            this.templateData = result.responseData;
            this.templateSubject = this.templateData['emailSubject'];
            this.ckEditorData = this.templateData['emailBody'];
            // console.log('selected template result', this.templateData);
          }
        },
        error: (error) => {
          if (error.status === 404 || error.status === 400) {
            console.log(error.message)
          }
          if (error.status === 204) {
            alert('Empty Response from server!!');
          }
          if (error.status === 503) {
            console.log('the server is not ready to handle the request');
          }
        },
      })
  }

  get f() { return this.saveTemplateForm.controls; }

  onSubmit(caseName) {
    this.submitted = true;
    if (this.saveNewTemplateInput === false && caseName == 'otherTemplateCase') {
      delete this.saveTemplateForm.value['templateNameNew'];
      this.templateErrorMessage = '';
      console.log('SUCCESS!! :-)\n\n' + JSON.stringify(this.saveTemplateForm.value));
      this.addTemplate(caseName);
      return true;
    }
    else if (this.saveTemplateForm.invalid) {
      this.templateErrorMessage = 'Error: one or more field value is missing';
      return false;
    } else {
      this.templateErrorMessage = '';
      console.log('SUCCESS!! :-)\n\n' + JSON.stringify(this.saveTemplateForm.value));
      this.addTemplate(caseName);
      return true;
    }
  }

  addTemplate(caseName) {
    // this.templateResult[0] is default template. this.templateData is data which comes on template dropdown onchange 
    if (this.saveNewTemplateInput) {
      this.templateName = this.saveTemplateForm.get('templateNameNew')?.value;
    } else if (this.templateData.length == 0) {
      this.templateName = this.templateResult[0]['name'];
    } else {
      this.templateName = this.templateData['name'];
    }

    // let userName='';
    // if(caseName == 'defaultTemplateCase'){
    //   userName = JSON.parse(localStorage.getItem('userinfoData') || '').PractitionerId;
    // } else {
    //   userName = this.templateData.length == 0 ? this.templateResult[0]['userId'] : this.templateData['userId'];
    // }

    let requestAddTemplate =
    {
      "languageId": this.templateData.length == 0 ? this.templateResult[0]['languageId'] : this.templateData['languageId'],
      "toolId": this.templateData.length == 0 ? this.templateResult[0]['toolId'] : this.templateData['toolId'],
      "UserFhirId": JSON.parse(localStorage.getItem('userinfoData') || '').PractitionerId,
      "emailSubject": this.saveTemplateForm.value.subject,
      "emailBody": this.saveTemplateForm.value.EmailBody,
      "name": this.templateName,
      "jsonData": this.templateData.length == 0 ? this.templateResult[0]['jsonData'] : this.templateData['jsonData'],
      "isActive": true
    }
    // addtemplate api
    // console.log(requestAddTemplate);

    this.http.post(this.addTemplateUrl, requestAddTemplate).
      subscribe({
        next: (result: any) => {
          // console.log('addTemplate-Result', result);
          if (result.statusCode === 200) {
            // this.saveTemplateForm.controls.templateName.setValue('');
            this.saveNewTemplateInput = false;
            this.defaultTemplateInput = true;
            this.addTemplateServerResponse = result.message;
            this.clearTime = setTimeout(() => {
              this.decline();
            }, 3000);
          }
        },
        error: (error) => {
          // console.log('addTemplate-error', error);
          if (error.status == 400) {
            this.templateErrorMessage = 'Server Error: ' + error.error.title;
          }
        },
      })
  }

  public accept() {
    // console.log('accept called');
    // console.log(this.saveTemplateForm.value);
    // console.log(this.selectedTemplateNameText);
    // console.log('flag status', this.saveNewTemplateInput);

    if (this.selectedTemplateNameText == '' || this.selectedTemplateNameText === undefined || this.selectedTemplateNameText === null || this.selectedTemplateNameText == 'Default') {
      this.defaultTemplateInput = false;
      this.saveTemplateForm.addControl('templateNameNew', new FormControl('', Validators.required));
      this.saveNewTemplateInput = true;

      if (this.saveTemplateForm.value.templateNameNew == '' || this.saveTemplateForm.value.templateNameNew === undefined) {
        this.templateErrorMessage = 'Enter new template name';
      } else if (this.checkSameString(this.saveTemplateForm.value.templateNameNew, "Default")) {
        this.templateErrorMessage = 'Error: "Default" is not allowed as new template name';
        this.addTemplateServerResponse = '';
      } else {
        // console.log('submit called');
        this.onSubmit('defaultTemplateCase');
      }
    }
    else if (this.saveNewTemplateInput === false && this.selectedTemplateNameText !== 'Default') {
      // console.log('dialog open - flag false');
      this.saveTemplateConfirmationDialog();
    }
    else if (this.saveNewTemplateInput === true && this.selectedTemplateNameText !== 'Default') {
      console.log('dialog open - flag true');
      if (this.checkSameString(this.saveTemplateForm.value.templateNameNew, "Default")) {
        this.templateErrorMessage = 'Error: "Default" is not allowed as new template name';
        this.addTemplateServerResponse = '';
        return false;
      }
      this.saveTemplateForm.addControl('templateNameNew', new FormControl('', Validators.required));
      this.saveNewTemplateInput = true;
      this.defaultTemplateInput = false;
      this.onSubmit('otherTemplateCase');
    }
  }

  saveTemplateConfirmationDialog() {
    this.templateConfirmationDialog
      .confirm("Please confirm..", "Do you like to save it as New template or continue with existing template?")
      .then((confirmed) => {
        // console.log("User confirmed:", confirmed);
        if (confirmed) {
          // user saving template as New template
          this.saveTemplateForm.addControl('templateNameNew', new FormControl('', Validators.required));
          this.saveNewTemplateInput = true;
          this.defaultTemplateInput = false;
        } else {
          this.saveNewTemplateInput = false;
          this.defaultTemplateInput = true;
          this.onSubmit('otherTemplateCase');
        }
      })
      .catch((error) => {} );
  }

  sendEmail() {
    let emailObj = JSON.parse(sessionStorage.getItem('composeFormEmail') || '');
    let sendEmailObj: any = {
      toEmail: [],
      assessmentId: [],
      subject: this.saveTemplateForm.value.subject,
      body: this.saveTemplateForm.value.EmailBody,
      fhirId: this.practionerId
    };

    for (const [key, value] of Object.entries(emailObj)) {
      if (this.validateEmail(value) !== undefined) {
        sendEmailObj.toEmail.push(this.validateEmail(value));
      }
    }

    Object.entries(JSON.parse(localStorage.getItem('shortUrlData') || '')).forEach(
      ([key, value]: any) => sendEmailObj.assessmentId.push(value.assessmentId)
    );
    this.emailSend(sendEmailObj);
  }

  emailSend(requestObj) {
    this.templateErrorMessage = '';
    this.sendEmailFlag = true;
    this.emailIsInProgress = true;
    this.http.post(this.sendEmailUrl, requestObj).
      subscribe({
        next: (result: any) => {
          this.emailIsInProgress = false;
          this.emailSuccess = true;
          this.emailResponse = result.status + "! " + result.message;
          this.clearTime = setTimeout(() => {
            this.activeModal.dismiss();
          }, 3000);
        },
        error: (error) => {},
      })
  }

  checkSameString(a, b) {
    return typeof a === 'string' && typeof b === 'string'
      ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
      : a === b;
  }

  discardTemplate() {
    // set email flat to false
    this.sendEmailFlag = false;
    this.emailIsInProgress = false;
    this.emailSuccess = false;

    // set form flag to false and reset default value
    this.saveNewTemplateInput = false;
    this.defaultTemplateInput = true;
    this.templateErrorMessage = '';
    this.saveTemplateForm.controls.templateNameNew.setValue('');
    this.selectedTemplateNameText = '';
    this.getTemplate();
  }

  public decline() {
    this.activeModal.close(false);
    clearTimeout(this.clearTime);
    this.saveNewTemplateInput = false;
    this.defaultTemplateInput = true;
    this.templateErrorMessage = '';
    this.saveTemplateForm.controls.templateNameNew.setValue('');
    this.selectedTemplateNameText = '';
    this.getTemplate();

    // set email flat to false
    this.sendEmailFlag = false;
    this.emailIsInProgress = false;
    this.emailSuccess = false;
  }

  public dismiss() {
    this.activeModal.dismiss();
    this.saveNewTemplateInput = false;
    this.defaultTemplateInput = true;
    this.templateErrorMessage = '';
    this.saveTemplateForm.controls.templateNameNew.setValue('');
    this.selectedTemplateNameText = '';
    this.getTemplate();

    // set email flat to false
    this.sendEmailFlag = false;
    this.emailIsInProgress = false;
    this.emailSuccess = false;
  }

  validateEmail(email) {
    return (email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )?.input;
  }

}
