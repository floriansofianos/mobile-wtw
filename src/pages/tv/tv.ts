import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { TvShowPage } from '../tv-show/tv-show';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-tv',
  templateUrl: 'tv.html',
})
export class TvPage {
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
      this.movieDBService.searchTV(this.searchTxt, this.lang).subscribe(
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

  goToTV(id) {
    this.navCtrl.push(TvShowPage, { id: id });
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
