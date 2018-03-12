import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TvRecommandationServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';
  constructor(public http: HttpClient) {
  }

  getScore(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/tvRecommandation/score', { params: { id: id.toString() } })
        .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
