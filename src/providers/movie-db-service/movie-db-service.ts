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

  search(s: string, lang: string) {
    return this.http.get(this.baseUrl + 'api/movieDBSearch', { params: { search: s, lang: lang } })
      .catch(this.handleErrors);
  }

  searchTV(s: string, lang: string) {
    return this.http.get(this.baseUrl + 'api/movieDBSearchTV', { params: { search: s, lang: lang } })
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

  getMovies(movieIds: Array<any>, lang: string) {
    return this.http.get(this.baseUrl + 'api/movie', { params: { movieIds: movieIds, lang: lang } })
      .catch(this.handleErrors);
  }

  getAllGenres() {
    return this.http.get(this.baseUrl + 'api/movieDBGenres')
      .catch(this.handleErrors);
  }

  getTVShows(movieIds: Array<any>, lang: string) {
    return this.http.get(this.baseUrl + 'api/tvshow', { params: { movieIds: movieIds, lang: lang } })
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

  tvAvailableOnPlex(id: number) {
    return this.http.get(this.baseUrl + 'api/tvshow/plex', { params: { id: id.toString() } })
      .catch(this.handleErrors);
  }

  wtw(lang: string, genreId: number, useWatchlist: boolean, useRuntimeLimit: boolean, runtimeLimit: number, minRelease: number, maxRelease: number, nowPlaying: boolean, languageSelected: boolean, friendId: number, usePlex: boolean) {
    return this.http.get(this.baseUrl + 'api/movieDBSearch/wtw', { params: { lang: lang, genreId: genreId.toString(), useWatchlist: useWatchlist.toString(), 
      useRuntimeLimit: useRuntimeLimit.toString(), runtimeLimit: runtimeLimit.toString(), minRelease: minRelease.toString(), maxRelease: maxRelease.toString(), 
      nowPlaying: nowPlaying.toString(), languageSelected: languageSelected.toString(), friendId: friendId.toString(), usePlex: usePlex.toString() } })
      .catch(this.handleErrors);
  }

  wtwTV(lang: string, genreId: number, useWatchlist: boolean, useRuntimeLimit: boolean, runtimeLimit: number, minRelease: number, maxRelease: number, languageSelected: boolean, friendId: number, usePlex: boolean) {
    return this.http.get(this.baseUrl + 'api/movieDBSearchTV/wtw', { params: { lang: lang, genreId: genreId.toString(), useWatchlist: useWatchlist.toString(),
       useRuntimeLimit: useRuntimeLimit.toString(), runtimeLimit: runtimeLimit.toString(), minRelease: minRelease.toString(), maxRelease: maxRelease.toString(), 
       languageSelected: languageSelected.toString(), friendId: friendId.toString(), usePlex: usePlex.toString() } })
      .catch(this.handleErrors);
  }

}
