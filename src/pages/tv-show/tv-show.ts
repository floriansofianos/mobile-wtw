import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TvQuestionnaireServiceProvider } from '../../providers/tv-questionnaire-service/tv-questionnaire-service';

import * as _ from 'underscore';

/**
 * Generated class for the TvShowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tv-show',
  templateUrl: 'tv-show.html',
})
export class TvShowPage {

  loadingWindow: Loading;
  config: any;
  id: number;
  lang: any;
  availableOnPlex: boolean;
  tvQuestionnaireInit: any;
  tv: any;
  tvQuestionnaire: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loading: LoadingController,
    private movieDBService: MovieDBServiceProvider, private auth: AuthServiceProvider,
    private tvQuestionnaireService: TvQuestionnaireServiceProvider) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();

    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.config = response;
      this.id = this.navParams.get('id');
      this.lang = this.auth.getCurrentUser().lang;

      if (this.auth.getCurrentUser().plexServerId) {
        this.movieDBService.tvAvailableOnPlex(this.id).subscribe(response => {
          this.availableOnPlex = response.available;
        },
          error => {
            console.log(error);
          });
      }

      // load existing data regarding this movie for the current user
      this.tvQuestionnaireService.get(this.id).subscribe(
        data => {
          this.tvQuestionnaireInit = data;
          this.movieDBService.getTV(this.id, this.lang).subscribe(
            data => {
              this.tv = data;
              // Get writers and actors from tv show
              var allWriters = _.filter(this.tv.tvShowCredits.crew, function (m) { return m.job === 'Screenplay' || m.job === 'Writer'; });
              var allActors = this.tv.tvShowCredits.cast;
              this.tv.writers = _.sortBy(allWriters, 'numberOfEpisodes').reverse().slice(0, Math.min(allWriters.length, 3));
              this.tv.actors = allActors.slice(0, Math.min(allActors.length, 4));
              this.loadingWindow.dismiss();
            },
            error => {
              console.log(error);
            }
          );
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

  tvQuestionnaireChange(data) {
    if (data.skipMovie) {
      this.back();
    }
    else this.tvQuestionnaire = data;
  }

  tvQuestionnaireSave(event) {
    this.confirm();
  }

  confirm() {
    // Add the questionnaire to DB
    //this.loadingWindow.present();
    // Save data in DB
    if (this.tvQuestionnaire) this.tvQuestionnaireService.create(this.tvQuestionnaire).subscribe(response => {
      //this.loadingWindow.dismiss();
      this.back();
    },
      error => {
        console.log(error);
      });
  }

  back() {
    this.navCtrl.pop();
  }

}
