import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssesmenthistoryComponent } from './assessment/assesment-history/assesmenthistory.component';
import { NotfoundComponent } from './assessment/not-found/not-found.component';
import { NewAssesmentComponent } from './assessment/new-assesment/new-assesment.component';
import { GenerateReportComponent } from './assessment/generate-report/generate-report.component';
import { CommonHeaderComponent } from './assessment/common-header/common-header.component';
import { GetjsondataService } from './getjsondata.service';
import { NgHttpLoaderModule } from 'ng-http-loader';

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewAssessmentEmailComponent } from './assessment/new-assessment-email/new-assessment-email.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { ComposeEmailComponent } from './assessment/compose-email/compose-email.component';
import { PreviewEmailComponent } from './preview-email/preview-email.component';
import { PreviewEmailService } from './preview-email/preview-email.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TemplateConfirmationDialogComponent } from './template-confirmation-dialog/template-confirmation-dialog.component';
import { ServerErrorDialogComponent } from './server-error-dialog/server-error-dialog.component';
import { ReturnObjectvaluePipe } from './shared/pipe/return-objectvalue.pipe';
import { ViewresponseDialogComponent } from './viewresponse-dialog/viewresponse-dialog.component';
import { GetResponseService } from './viewresponse-dialog/get-response.service';
import { SendTomychartDialogComponent } from './send-tomychart-dialog/send-tomychart-dialog.component';
import { SendtoChartService } from './send-tomychart-dialog/sendto-chart.service';
import { CommonDialogComponent } from './shared/common-dialog/common-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AssesmenthistoryComponent,
    NotfoundComponent,
    NewAssesmentComponent,
    GenerateReportComponent,
    ComposeEmailComponent,
    CommonHeaderComponent,
    NewAssessmentEmailComponent,
    ConfirmationDialogComponent,
    PreviewEmailComponent,
    TemplateConfirmationDialogComponent,
    ServerErrorDialogComponent,
    ReturnObjectvaluePipe,
    ViewresponseDialogComponent,
    SendTomychartDialogComponent,
    CommonDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    ConfirmDialogModule,
    CKEditorModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,    
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MessagesModule,
    NgHttpLoaderModule.forRoot(),
    ReactiveFormsModule,
    RippleModule,
    ToastModule
  ],
  providers: [
    GetjsondataService,
    ConfirmationDialogService,
    PreviewEmailService,
    GetResponseService,
    SendtoChartService],
  entryComponents: [CommonDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
