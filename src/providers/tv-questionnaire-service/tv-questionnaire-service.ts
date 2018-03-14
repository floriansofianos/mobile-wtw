import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TvQuestionnaireServiceProvider {

  baseUrl = 'https://app.whatowatch.net/';
  constructor(public http: HttpClient) { }

  get(id: number) {
    return this.http.get(this.baseUrl + '/api/tvQuestionnaire/' + id)
      .catch(this.handleErrors);
  }

  create(tvQuestionnaire: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/tvQuestionnaire', tvQuestionnaire)
      .catch(this.handleErrors);
  }

  getWatchlist(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/tvQuestionnaire/watchlist')
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
