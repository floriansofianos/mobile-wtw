import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MovieQuestionnaireServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';
  constructor(public http: HttpClient) { }

  get(id: number) {
    return this.http.get(this.baseUrl + 'api/movieQuestionnaire/' + id)
      .catch(this.handleErrors);
  }

  getWatchlist() {
    return this.http.get(this.baseUrl + 'api/movieQuestionnaire/watchlist')
      .catch(this.handleErrors);
  }

  create(movieQuestionnaire: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/movieQuestionnaire', movieQuestionnaire)
      .catch(this.handleErrors);
  }

  getCast(directorId: number, writerId: number, actorId: number, creatorId: number, lang: string): Observable<any> {
    var params: any = {};
    if (directorId) params.directorId = directorId;
    if (writerId) params.writerId = writerId;
    if (actorId) params.actorId = actorId;
    if (creatorId) params.creatorId = creatorId;
    params.lang = lang;
    return this.http.get(this.baseUrl + 'api/cast', { params: params })
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
