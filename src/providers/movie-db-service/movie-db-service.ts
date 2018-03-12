import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MovieDBServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';
  constructor(public http: HttpClient) {
  }

  getMovieDBConfiguration(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/movieDBConfiguration')
      .catch(this.handleErrors);
  }

  getMovie(id: number, lang: string) {
    return this.http.get(this.baseUrl + 'api/movie', { params: { id: id.toString(), lang: lang } })
      .catch(this.handleErrors);
  }

  getTV(id: number, lang: string) {
    return this.http.get(this.baseUrl + 'api/tvshow', { params: { id: id.toString(), lang: lang } })
      .catch(this.handleErrors);
  }

  availableOnPlex(id: number) {
    return this.http.get(this.baseUrl + 'api/movie/plex', { params: { id: id.toString() } })
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

  tvAvailableOnPlex(id: number) {
    return this.http.get(this.baseUrl + 'api/tvshow/plex', { params: { id: id.toString() } })
      .catch(this.handleErrors);
  }

}
