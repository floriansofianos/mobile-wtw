import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';

  constructor(public http: HttpClient) {
  }

  getAllFriends(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user/friends/')
      .catch(this.handleErrors);
  }

  getAvatar(userId: number, size: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user/avatar/' + userId, { params: { size: size } })
      .catch(this.handleErrors);
  }

  deleteAvatar(): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/user/avatar')
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }
}
