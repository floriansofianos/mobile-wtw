import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LanguagesServiceProvider {

  baseUrl = 'https://app.whatowatch.net/';

  constructor(public http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/languages')
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
