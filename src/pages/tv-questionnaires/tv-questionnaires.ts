import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { TvQuestionnaireServiceProvider } from '../../providers/tv-questionnaire-service/tv-questionnaire-service';
import * as _ from 'underscore';
import { TvShowPage } from '../tv-show/tv-show';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-tv-questionnaires',
  templateUrl: 'tv-questionnaires.html',
})
export class TvQuestionnairesPage {
  loadingWindow: Loading;
  startNewClicked: boolean;
  categories: Array<any>;
  categoriesNotLoaded: boolean
  configuration: any;
  lang: string;
  parentSubject:Subject<any> = new Subject();

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider,
    private loading: LoadingController, private tvQuestionnaireService: TvQuestionnaireServiceProvider,
    private movieDBService: MovieDBServiceProvider) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();

    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.categoriesNotLoaded = true;
      this.configuration = response;
      this.lang = this.auth.getCurrentUser().lang;

      this.tvQuestionnaireService.getAll().subscribe(data => {
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
      this.navCtrl.push(TvShowPage, { id: event.movieId })
    }
  }

  startNewQuestionnaire() {
    this.startNewClicked = true;
  }

  ionViewWillEnter() {
    this.parentSubject.next('reload');
  }
}
