import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { Router } from '@angular/router';
import { GetjsondataService } from 'src/app/getjsondata.service';

@Component({
  selector: 'app-new-assesment',
  templateUrl: './new-assesment.component.html',
  styleUrls: ['./new-assesment.component.css']
})
export class NewAssesmentComponent implements OnInit {
  headerPageTitle = 'New Assesment';
  resultData!: any;
  public spinkit = Spinkit;
  constructor(private jsonDataService: GetjsondataService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getDataServer();
  }

  getDataServer() {
    let obj = this.jsonDataService.getProductData();
    obj.subscribe((data:any) => {
      console.log('getResponse:', data);
      this.resultData = data.responseData;
    })
  };

  navigateToEmail(id) {
    this.jsonDataService.passDataToComponent(id)
  }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

}
