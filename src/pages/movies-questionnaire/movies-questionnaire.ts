import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MovieQuestionnaireServiceProvider } from '../../providers/movie-questionnaire-service/movie-questionnaire-service';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';

import * as _ from 'underscore';
import { MoviePage } from '../movie/movie';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-movies-questionnaire',
  templateUrl: 'movies-questionnaire.html',
})
export class MoviesQuestionnairePage {
  loadingWindow: Loading;
  startNewClicked: boolean;
  categories: Array<any>;
  categoriesNotLoaded: boolean
  configuration: any;
  lang: string;
  parentSubject:Subject<any> = new Subject();

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider,
    private loading: LoadingController, private movieQuestionnaireService: MovieQuestionnaireServiceProvider,
    private movieDBService: MovieDBServiceProvider) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();

    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.categoriesNotLoaded = true;
      this.configuration = response;
      this.lang = this.auth.getCurrentUser().lang;

      this.movieQuestionnaireService.getAll().subscribe(data => {
        this.loadingWindow.dismiss();
        let movieQuestionnaires = _.filter(data, (d) => { return (!d.isSkipped) && (d.isSeen || !d.wantToSee) });
        this.categories = [];
        for (let i = 1; i <= 5; i++) {
          this.categories.push({
            name: i.toString(), type: 'star', values: _.map(_.filter(movieQuestionnaires, (m) => { return m.isSeen && m.rating == i }), 'movieDBId')
          });
        }
        this.categories.reverse();
        this.categories.push({
          name: 'QUESTIONNAIRE.NOT_WANT_TO_SEE', type: 'text', values: _.map(_.filter(movieQuestionnaires, (m) => { return !m.isSeen && !m.wantToSee }), 'movieDBId')
        });
        this.categoriesNotLoaded = false;

      },
        error => {
          throw new Error(error);
        }
      );

    },
      error => {
        throw new Error(error);
      });
  }

  onClickMovie(event) {
    if(event.movieId) {
      this.navCtrl.push(MoviePage, { id: event.movieId })
    }
  }

  startNewQuestionnaire() {
    this.startNewClicked = true;
  }

  ionViewWillEnter() {
    this.parentSubject.next('reload');
  }

}
