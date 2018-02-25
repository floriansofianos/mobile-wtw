import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Storage } from '@ionic/storage';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';

  constructor(public http: HttpClient, private storage: Storage) {
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/token', 'email=' + credentials.email + '&password=' + credentials.password, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  }

  setUserInSession(token: string) {
    this.storage.set('token', token);
  }

}