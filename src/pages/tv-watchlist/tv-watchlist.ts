import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TvQuestionnaireServiceProvider } from '../../providers/tv-questionnaire-service/tv-questionnaire-service';

import * as _ from 'underscore';
import { TvShowPage } from '../tv-show/tv-show';

/**
 * Generated class for the TvWatchlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tv-watchlist',
  templateUrl: 'tv-watchlist.html',
})
export class TvWatchlistPage {

  loadingWindow: Loading;
  lang: string;
  configuration: any;
  movieIds: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loading: LoadingController, 
    private movieDBService: MovieDBServiceProvider, private auth: AuthServiceProvider, private tvQuestionnaireService: TvQuestionnaireServiceProvider) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();

    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.configuration = response;
      this.lang = this.auth.getCurrentUser().lang;

      this.tvQuestionnaireService.getWatchlist().subscribe(data => {
        this.loadingWindow.dismiss();
        this.movieIds = _.map(data, (d) => { return d.movieDBId.toString() });
        
    },
        error => {
            console.log(error);
        }
    );

    },
    error => {
      console.log(error);
    });
  }

  onClickMovie(event) {
    if(event.movieId) {
      this.navCtrl.push(TvShowPage, { id: event.movieId })
    }
  }


}
