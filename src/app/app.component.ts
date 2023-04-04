import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetjsondataService } from './getjsondata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mhs';
  paramsData: any;

  constructor(private customerService: GetjsondataService, private route: ActivatedRoute) { this.getIssAndLaunchKeyFromRoute();  }

  ngOnInit(): void {
   
  }

  // get launch and iss key from activated route on application load
  getIssAndLaunchKeyFromRoute() {
    this.route.queryParams
      .subscribe({
        next: (params) => {
          console.log('RouteParams-AppComponent: ', params);
          if (params['iss'] && params['launch']) {
            if (params['iss'].length > 1 && params['iss'] instanceof Object) {
              console.log(typeof params['iss']);
              params['iss'].splice(1, 1);
            }
            if (params['launch'].length > 1 && params['launch'] instanceof Object) {
              params['launch'].splice(1, 1);
            }
            // console.log('after change: ', params);
            this.paramsData = params;
            this.getAuthApi_Token();
          }
        },
        error: (err: any) => { console.error(err) },
        complete: () => { }
      }
      );
  }

  // calling service method to get api_token of user info
  getAuthApi_Token() {
    let obj = this.customerService.get_apiData(this.paramsData);
    obj.subscribe(
      {
        next: (data) => {
          console.log('auth_token', data);
          if (data.hasOwnProperty('access_token') && data.hasOwnProperty('api_token')) {
            localStorage.setItem('api_token', JSON.stringify(data.api_token));
          }
        },
        error: (err: any) => { console.log(err); },
        complete: () => {
          console.log('decrypted_info', this.decryptApi_token(localStorage.getItem('api_token')));
          localStorage.setItem('userinfoData', JSON.stringify(this.decryptApi_token(localStorage.getItem('api_token'))));
          window.location.reload();
        }
      }
    )
  };

  decryptApi_token(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.log(e);
      return null;
    }
  }

}
