import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { MoviePage } from '../movie/movie';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-movies',
  templateUrl: 'movies.html',
})
export class MoviesPage {
  searchTxt: string;
  configuration: any;
  searchResults: Array<any>;
  lang: string;
  loadingWindow: any;
  parentSubject:Subject<any> = new Subject();

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, private movieDBService: MovieDBServiceProvider, private loading: LoadingController) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.lang = this.auth.getCurrentUser().lang;
    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.configuration = response;
      this.loadingWindow.dismiss();
    },
      error => {
        console.log(error);
      });
  }

  search() {
    if (this.searchTxt && this.searchTxt.trim()) {
      this.loadingWindow = this.loading.create();
      this.loadingWindow.present();
      this.movieDBService.search(this.searchTxt, this.lang).subscribe(
        data => {
          this.searchResults = data;
          if (this.searchResults.length < 1) {

          }
          this.loadingWindow.dismiss();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  goToMovie(id) {
    this.navCtrl.push(MoviePage, { id: id });
  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      // Enter pressed
      this.search();
    }
  }

  ionViewWillEnter() {
    this.parentSubject.next('reload');
  }

}
