import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject, from, of, range, throwError } from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewAssessmentService {

  results: any;
  errorMessage: any;
  dummyJsonUrl: string='https://dummyjson.com/users';
  productsUrl: string = 'https://epicapi.portages.io/api/mhs/products';
  productsUrlNew: string = 'https://epicapi.portages.io/api/mhs/products';


  constructor(private http: HttpClient) { }

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

}


