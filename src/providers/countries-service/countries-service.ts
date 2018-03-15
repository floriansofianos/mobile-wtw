import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class CountriesServiceProvider {

  baseUrl = 'https://app.whatowatch.net/';

  constructor(public http: HttpClient) {
    
  }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/countries')
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }
}
