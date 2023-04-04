import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { merge, throwError } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PrimeNGConfig } from 'primeng/api';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ServerErrorDialogComponent } from 'src/app/server-error-dialog/server-error-dialog.component';

import { GetjsondataService } from 'src/app/getjsondata.service';

@Component({
  selector: 'app-assesmenthistory',
  templateUrl: './assesmenthistory.component.html',
  styleUrls: ['./assesmenthistory.component.css'],
  providers: []
})
export class AssesmenthistoryComponent implements OnInit, AfterViewInit {
  isValidData = true;
  headerPageTitle = 'Assesment History';
  paramsData: any;
  totalRecords!: number;
  isLoadingResults = true;
  isRateLimitReached = false;
  cols: any[] = [];
  selectAll: boolean = false;
  currentUser: any;
  result: string = '';
  public spinkit = Spinkit;
  public userData: any;
  isDisabled = true;

  // displayedColumns: string[] = ['id', 'date', 'productDescription', 'raterName', 'raterType', 'status',];

  dynamicColumns = [
    // {
    //   columnDef: 'id',
    //   header: 'ID',
    //   cell: row => row.id,
    // }, 
    {
      columnDef: 'date',
      header: 'Date',
      cell: row => row.date,
    }, {
      columnDef: 'productDescription',
      header: 'Product Description',
      link: row => ([row.id]),
      cell: row => row.productDescription,
    }, {
      columnDef: 'raterType',
      header: 'Rater Type',
      cell: row => row.raterType,
    }, {
      columnDef: 'raterName',
      header: 'Rater Name',
      cell: row => row.raterName,
    }, {
      columnDef: 'status',
      header: 'Status',
      cell: row => row.status,
    }
  ];

  displayedColumns = [
    ...this.dynamicColumns.map(x => x.columnDef),
    'action', 'generateReport'
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private customerService: GetjsondataService, private route: ActivatedRoute, private router: Router) {
    
    // this.getPromiseResult();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.observableRequest();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  async getPromiseResult() {
    this.isLoadingResults = true;
    const data = await this.customerService.getResponsePromise();
    if (data)
      this.isLoadingResults = false;
    this.dataSource.data = data.responseData;
  }

  observableRequest() {
    const data = this.customerService.getResponseObservable().subscribe(
      (data: any) => {
        console.log(this.dataSource.data.length);
        this.dataSource.data = data.responseData;
      }
    );
  }

  generateReport(row) {
    this.router.navigate(['/GenerateReport']);
  }
}










