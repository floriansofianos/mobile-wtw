import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MovieQuestionnaireServiceProvider } from '../../providers/movie-questionnaire-service/movie-questionnaire-service';

import * as _ from 'underscore';
import { MoviePage } from '../movie/movie';

@Component({
  selector: 'page-movies-watchlist',
  templateUrl: 'movies-watchlist.html',
})
export class MoviesWatchlistPage {

  loadingWindow: Loading;
  lang: string;
  configuration: any;
  movieIds: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loading: LoadingController, 
    private movieDBService: MovieDBServiceProvider, private auth: AuthServiceProvider, private movieQuestionnaireService: MovieQuestionnaireServiceProvider) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();

    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.configuration = response;
      this.lang = this.auth.getCurrentUser().lang;

      this.movieQuestionnaireService.getWatchlist().subscribe(data => {
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
      this.navCtrl.push(MoviePage, { id: event.movieId })
    }
  }



}
