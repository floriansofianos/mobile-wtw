import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the TimelineServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimelineServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';
  constructor(public http: HttpClient) {
  }

  get(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(this.baseUrl + 'api/timeline', { params: params })
        .catch(this.handleErrors);
}

handleErrors(error: Response) {
    return Observable.throw(error.status);
}

}
