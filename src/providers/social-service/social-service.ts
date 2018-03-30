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

  search(search: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user', { params: { search: search } })
      .catch(this.handleErrors);
  }

  getUsersThatAlsoLiked(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user/usersThatLiked')
      .catch(this.handleErrors);
  }

  getUsersThatAlsoTVLiked(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user/usersThatTVLiked')
      .catch(this.handleErrors);
  }

  getUserProfile(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user/' + id)
      .catch(this.handleErrors);
  }

  getUserDistance(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/user/distance/' + id)
      .catch(this.handleErrors);
  }

  getPendingFriend(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/friend/pending/' + id)
      .catch(this.handleErrors);
  }

  getFriend(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/friend/' + id)
      .catch(this.handleErrors);
  }

  followUser(id: number): Observable<any> {
    return this.http.post(this.baseUrl + 'api/follow/' + id, {})
      .catch(this.handleErrors);
  }

  addToFriend(id: number): Observable<any> {
    return this.http.post(this.baseUrl + 'api/friend/' + id, {})
      .catch(this.handleErrors);
  }

  removeFromFriend(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/friend/' + id)
      .catch(this.handleErrors);
  }

  unfollowUser(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/follow/' + id)
      .catch(this.handleErrors);
  }

  acceptFriend(id: number, notificationId: number): Observable<any> {
    return this.http.post(this.baseUrl + 'api/friend/accept/' + id, { notificationId: notificationId })
      .catch(this.handleErrors);
  }

  refuseFriend(id: number, notificationId: number): Observable<any> {
    return this.http.post(this.baseUrl + 'api/friend/refuse/' + id, { notificationId: notificationId })
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
