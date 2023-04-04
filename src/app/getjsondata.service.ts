import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError, throwError, BehaviorSubject, Observable, shareReplay, of } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ConfirmDialogModel, ServerErrorDialogComponent } from 'src/app/server-error-dialog/server-error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GetjsondataService {

  // baseUrl: string = "https://adminportalapiuat.portages.io/api/epic" + '/auth';
  baseUrl: string = "https://epicapi.portages.io/api/epic" + '/auth';

  public _url: string = "https://gist.githubusercontent.com/avinashkonduri/8dbe87e0836f2a1ed195700b6c8bd025/raw/61b88bc1b35ee051cce4b97d7957a78922890d18/people.json";
  myChartData: any;
  localhostUrl: string = 'http://localhost/phptest/index.php';
  // assessmentHistoryUrl = 'https://epicapi.portages.io/api/MHS/' + 'getassessmenthistory/' + 'eSyJg8Ez6.FgkTl4ZMNOAFQ3';
  assessmentHistoryUrl = 'https://10.131.96.50:44332/api/MHS/' + 'getassessmenthistory/';

  // getGenerateReportOptionUrl = 'https://epicapi.portages.io/api/Report/' + 'getreportoption/';
  getGenerateReportOptionUrl = 'https://10.131.96.50:44332/api/Report/' + 'getreportoption/';
  viewResponseUrl = 'https://10.131.96.50:44332/api/Report/' + 'getviewresponses/';

  errorMessage: any;
  productsUrl: string = 'https://epicapi.portages.io/api/mhs/products';
  // productsUrlNew: string = 'https://epicapi.portages.io/api/mhs/products';
  productsUrlNew: string = 'https://10.131.96.50:44332/api/mhs/products';
  result: string = '';
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  public assessment: Observable<Assessment[]> = of([]);

  constructor(public dialog: MatDialog, private http: HttpClient, private router: Router) {}

  // get encode "api_token" key which contain active user info
  get_apiData(paramsdata: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("iss", paramsdata.iss);
    queryParams = queryParams.append("launch", paramsdata.launch);

    return this.http.get(this.baseUrl, { params: queryParams })
      .pipe(
        map(res => {
          if (res) {
            console.log(res);
            return res;
          }
        }),
        catchError(this.erroHandler),
      );
  }

  setAuthApiTokenToStorage() { }

  getData() {
    return this.http.get(this._url);
  }

  getLocalhostData() {
    const requestUrl = `${this.assessmentHistoryUrl}`;
    return this.http.get(requestUrl).
      pipe(
        map(res => {
          if (res) {
            return res;
          }
          return false;
        }),
        catchError(this.erroHandler),
      );
  }

  getProductData() {
    return this.http.get(this.productsUrlNew).
      pipe(
        map(res => {
          if (res) {
            return res;
          }
          return false;
        }),
        catchError(this.erroHandler),
      );
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || 'server Error'));
  }

  // this method used to pass id from newassesment to newassessmentEmail component using service
  passDataToComponent(id: any) {
    this.router.navigate(['NewAssesmentEmail']);
    this.messageSource.next(id);
  }

  passDataToComposeEmail(assessmentData: any) {
    this.router.navigate(['ComposeEmail']);
    this.messageSource.next(assessmentData);
  }

  serverErrorDialog(dialogMessage, dialogTitle, backDropDisable, actionButton): void {
    const dialogData = new ConfirmDialogModel(dialogTitle, dialogMessage, actionButton);
    const dialogRef = this.dialog.open(ServerErrorDialogComponent, {
      maxWidth: "400px",
      data: dialogData,
      disableClose: backDropDisable
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

  getResponsePromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.assessmentHistoryUrl)
        .subscribe({
          next: (data: any) => { resolve(data) },
          error: (err: any) => { reject(err) },
        });
    });
  }

  getResponseObservable(): Observable<Assessment[]> {
    let fHrid;
    fHrid = JSON.parse(localStorage.getItem('userinfoData') || '{}');
    fHrid = fHrid.PatientId;

    console.log('fHrid::', fHrid);
   
    this.assessment = this.http.get<Assessment[]>(this.assessmentHistoryUrl + fHrid).pipe(shareReplay(1));
    console.log(this.assessment);
    return this.assessment;
  }

  getGenerateReportOptionData(catalogId) {
    let generateReportResult = this.http.get(this.getGenerateReportOptionUrl + catalogId).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent)
          errorMsg = `Error: ${error.error.message}`;
        else
          errorMsg = this.getServerErrorMessage(error);

        return throwError(() => new Error(errorMsg));
      }),
    );
    return generateReportResult;
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }
    }
  }


  getViewResponseData(assessmentId) {
    let viewResponseResult = this.http.get(this.viewResponseUrl + assessmentId).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent)
          errorMsg = `Error: ${error.error.message}`;
        else
          errorMsg = error;

        return throwError(() => new Error(errorMsg));
      }),
    );
    return viewResponseResult;
  }

  sendmyChartEmail(): Observable<Assessment[]> {
    this.myChartData = this.http.get<Assessment[]>(this._url).pipe(shareReplay(1));
    return this.myChartData;
  }

}


export interface Assessment {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}


