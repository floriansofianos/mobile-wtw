import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';

@Component({
  selector: 'page-first-questionnaire',
  templateUrl: 'first-questionnaire.html',
})
export class FirstQuestionnairePage {

  configuration: any;
  loadingWindow: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private movieDBService: MovieDBServiceProvider, private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.loadingWindow = this.loadingCtrl.create();
    this.loadingWindow.present();
    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.configuration = response;
      this.loadingWindow.dismiss();
    },
      error => {
        throw new Error(error);
      });
  }

}
