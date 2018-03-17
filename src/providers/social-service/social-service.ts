import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SocialServiceProvider {

  baseUrl = 'https://app.whatowatch.net/';
  constructor(public http: HttpClient) {
  }

  getAllFriends(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/friend/')
      .catch(this.handleErrors);
  }

  getUserProfiles(ids: Array<string>): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user/profiles', { params: { userIds: ids } })
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
