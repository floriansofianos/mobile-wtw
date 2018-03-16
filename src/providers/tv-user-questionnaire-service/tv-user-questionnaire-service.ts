import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the TvUserQuestionnaireServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TvUserQuestionnaireServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';

  constructor(public http: HttpClient) {
  }

  get(lang: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/userTVQuestionnaire?lang=' + lang)
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
