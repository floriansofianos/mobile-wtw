import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MovieQuestionnaireServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';
  constructor(public http: HttpClient) {}

  get(id: number) {
    return this.http.get(this.baseUrl + '/api/movieQuestionnaire/' + id)
        .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
