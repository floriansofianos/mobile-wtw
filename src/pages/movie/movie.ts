import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MovieQuestionnaireServiceProvider } from '../../providers/movie-questionnaire-service/movie-questionnaire-service';

@Component({
    selector: 'page-movie',
    templateUrl: 'movie.html',
})
export class MoviePage {

    loadingWindow: Loading;
    config: any;
    id: number;
    lang: any;
    availableOnPlex: boolean;
    movieQuestionnaireInit: any;
    movie: any;
    movieQuestionnaire: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loading: LoadingController,
        private movieDBService: MovieDBServiceProvider, private auth: AuthServiceProvider,
        private movieQuestionnaireService: MovieQuestionnaireServiceProvider) {
        this.loadingWindow = this.loading.create();
        this.loadingWindow.present();

        this.movieDBService.getMovieDBConfiguration().subscribe(response => {
            this.config = response;
            this.id = this.navParams.get('id');
            this.lang = this.auth.getCurrentUser().lang;

            if (this.auth.getCurrentUser().plexServerId) {
                this.movieDBService.availableOnPlex(this.id).subscribe(response => {
                    this.availableOnPlex = response.available;
                },
                    error => {
                        throw new Error(error);
                    });
            }

            // load existing data regarding this movie for the current user
            this.movieQuestionnaireService.get(this.id).subscribe(
                data => {
                    this.movieQuestionnaireInit = data;
                    this.movieDBService.getMovie(this.id, this.lang).subscribe(
                        data => {
                            this.movie = data;
                            this.loadingWindow.dismiss();
                        },
                        error => {
                            throw new Error(error);
                        }
                    );
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

    movieQuestionnaireChange(data) {
        if (data.skipMovie) {
            this.back();
        }
        else this.movieQuestionnaire = data;
    }

    movieQuestionnaireSave(event) {
        this.confirm();
    }

    confirm() {
        // Add the questionnaire to DB
        //this.loadingWindow.present();
        // Save data in DB
        if (this.movieQuestionnaire) this.movieQuestionnaireService.create(this.movieQuestionnaire).subscribe(response => {
            //this.loadingWindow.dismiss();
            this.back();
        },
            error => {
                throw new Error(error);
            });
    }

    back() {
        this.navCtrl.pop();
    }

}
