import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationServiceProvider {

  baseUrl = 'https://app.whatowatch.net/';

  constructor(public http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/notification')
      .catch(this.handleErrors);
  }

  readAllReadOnly(): Observable<any> {
    return this.http.post(this.baseUrl + 'api/notification/read', {})
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
