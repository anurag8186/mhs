import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssesmenthistoryComponent } from './assessment/assesment-history/assesmenthistory.component';
import { NotfoundComponent } from './assessment/not-found/not-found.component';
import { NewAssesmentComponent } from './assessment/new-assesment/new-assesment.component';
import { NewAssessmentEmailComponent } from './assessment/new-assessment-email/new-assessment-email.component';
import { GenerateReportComponent } from './assessment/generate-report/generate-report.component';
import { ComposeEmailComponent } from './assessment/compose-email/compose-email.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'assesmentHistory',
    pathMatch: 'full'
  },
  {
    path: 'assesmentHistory',
    component: AssesmenthistoryComponent
  },
  { 
    path: 'NewAssesment', 
    component: NewAssesmentComponent 
  },
  { 
    path: 'NewAssesmentEmail', 
    component: NewAssessmentEmailComponent 
  },
  { 
    path: 'GenerateReport', 
    component: GenerateReportComponent 
  },
  { 
    path: 'ComposeEmail', 
    component: ComposeEmailComponent 
  },
  {
    path: '**',
    redirectTo: 'page_not_found'
  },
  {
    path: 'page_not_found',
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
