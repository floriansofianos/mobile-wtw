import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  baseUrl = 'http://localhost:1337/';
  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/token', 'email=' + credentials.email + '&password=' + credentials.password, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  }

}
