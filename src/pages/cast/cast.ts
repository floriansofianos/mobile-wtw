import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { MovieQuestionnaireServiceProvider } from '../../providers/movie-questionnaire-service/movie-questionnaire-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { MoviePage } from '../movie/movie';

import * as _ from 'underscore';

@Component({
  selector: 'page-cast',
  templateUrl: 'cast.html',
})
export class CastPage {

  loadingWindow: Loading;
  crewType: any;
  castMember: any;
  lang: any;
  config: any;
  currentMovieId: any;
  job: any;
  moviesFiltered: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loading: LoadingController, private movieQuestionnaireService: MovieQuestionnaireServiceProvider, private auth: AuthServiceProvider) {

    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();

    this.crewType = this.navParams.get('crewType');
    this.castMember = this.navParams.get('castMember');
    this.config = this.navParams.get('config');
    this.currentMovieId = this.navParams.get('currentMovieId');
    this.job = this.navParams.get('job');
    this.lang = this.auth.getCurrentUser().lang;


    this.movieQuestionnaireService.getCast(this.crewType === 0 ? this.castMember.id : null, this.crewType === 1 ? this.castMember.id : null, this.crewType === 2 ? this.castMember.id : null, this.crewType === 3 ? this.castMember.id : null, this.lang).subscribe(response => {
      this.getAllMoviesFiltered(response);
      this.loadingWindow.dismiss();
    },
      error => {
        console.log(error);
      });
  }

  getAllMoviesFiltered(details: any) {
    let movies = details;
    let movieId = this.currentMovieId;
    let moviesFiltered = _.filter(movies, function (m) {
      return m.id !== movieId;
    });
    if (this.crewType === 0) {
      moviesFiltered = _.filter(moviesFiltered, function (m) {
        return m.job === 'Director';
      });
    }
    if (this.crewType === 1) {
      moviesFiltered = _.filter(moviesFiltered, function (m) {
        return m.job === 'Screenplay' || m.job === 'Writer';
      });
    }
    this.moviesFiltered = _.sortBy(moviesFiltered, 'popularity').reverse();
  }

  isImgProfile(file: string) {
    if (file === null || file === '') return false;
    else return true;
  }

  goToMovie(id) {
    this.navCtrl.push(MoviePage, { id: id });
  }

}
