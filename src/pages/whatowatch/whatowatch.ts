import { Component } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { MovieRecommandationServiceProvider } from '../../providers/movie-recommandation-service/movie-recommandation-service';
import { TvRecommandationServiceProvider } from '../../providers/tv-recommandation-service/tv-recommandation-service';
import { LanguagesServiceProvider } from '../../providers/languages-service/languages-service';
import { SocialServiceProvider } from '../../providers/social-service/social-service';
import { MoviePage } from '../movie/movie';
import { TvShowPage } from '../tv-show/tv-show';
import * as _ from 'underscore';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-whatowatch',
  templateUrl: 'whatowatch.html',
})
export class WhatowatchPage {

  loadingWindow: Loading;
  configuration: any;
  lang: string;
  recommandationIds: Array<any>;
  noReco: boolean;
  genres: Array<any>;
  formWTW: any;
  formTVWTW: any;
  movie: any;
  movieQuestionnaireInit: any;
  movieQuestionnaireInitLoaded: boolean;
  movieQuestionnaire: any;
  showSaveSpinner: boolean;
  isLoading: boolean;
  username: string;
  noResults: boolean;
  noTVResults: boolean;
  notValidReleaseDates: boolean;
  notValidTVReleaseDates: boolean;
  showPlex: boolean;
  maxReleaseYear: number;
  languages: Array<any>;
  friends: Array<any>;
  recommandationTVIds: Array<any>;
  noTVReco: boolean;
  isMovie: boolean;
  parentSubject:Subject<any> = new Subject();

  constructor(private authService: AuthServiceProvider, private movieDBService: MovieDBServiceProvider, private movieRecommandation: MovieRecommandationServiceProvider,
    private tvRecommandation: TvRecommandationServiceProvider, private languagesService: LanguagesServiceProvider, 
    private socialService: SocialServiceProvider, private navCtrl: NavController, private loading: LoadingController) { }

  ngOnInit() {
    this.formWTW = {};
    this.formTVWTW = {};
    this.isMovie = true;
    this.maxReleaseYear = new Date().getFullYear();
    let currentUser = this.authService.getCurrentUser();
    this.showPlex = currentUser.plexServerId != undefined;
    this.formWTW.minRelease = currentUser.yearOfBirth ? currentUser.yearOfBirth : new Date().getFullYear() - 50;
    this.formWTW.maxRelease = new Date().getFullYear();
    this.formTVWTW.minRelease = currentUser.yearOfBirth ? currentUser.yearOfBirth : new Date().getFullYear() - 50;
    this.formTVWTW.maxRelease = new Date().getFullYear();
    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.configuration = response;
    },
      error => {
        console.log(error);
      });
    this.lang = currentUser.lang;
    this.formWTW.isRuntimeChecked = false;
    this.formTVWTW.isRuntimeChecked = false;
    this.socialService.getAllFriends().subscribe(response => {
      let allFriends = response;
      if (allFriends.length > 0) {
        this.socialService.getUserProfiles(_.map(allFriends, function (f) { return f.friendUserId; })).subscribe(response => {
          this.friends = response.users;
        },
          error => {
            console.log(error);
          });
      }
    },
      error => {
        console.log(error);
      });
    this.movieDBService.getAllGenres().subscribe(response => {
      this.genres = response;
      this.languagesService.getAll().subscribe(response => {
        this.languages = response.languages;
        this.movieRecommandation.getAll().subscribe(response => {
          if (response.length > 0) {
            this.recommandationIds = _.sample(_.map(response, 'movieDBId'), 5);
          }
          else this.noReco = true;
        },
          error => {
            console.log(error);
          });
        this.tvRecommandation.getAll().subscribe(response => {
          if (response.length > 0) {
            this.recommandationTVIds = _.sample(_.map(response, 'movieDBId'), 5);
          }
          else this.noTVReco = true;
        },
          error => {
            console.log(error);
          });
      },
        error => {
          console.log(error);
        });
    },
      error => {
        console.log(error);
      });

  }

  onClickMovie(event) {
    if (event.movieId) {
      this.navCtrl.push(MoviePage, { id: event.movieId })
    }
  }

  onClickTV(event) {
    if (event.movieId) {
      this.navCtrl.push(TvShowPage, { id: event.movieId })
    }
  }

  clickSearch() {
    if (this.formWTW.minRelease <= this.formWTW.maxRelease && this.formWTW.maxRelease <= new Date().getFullYear()) {
      this.loadingWindow = this.loading.create();
      this.loadingWindow.present();
      this.movieDBService.wtw(this.lang, this.formWTW.genreSelectValue, this.formWTW.isWatchlistChecked, 
        this.formWTW.isRuntimeChecked, this.formWTW.runtimeLimit, this.formWTW.minRelease, this.formWTW.maxRelease, 
        this.formWTW.isNowPlayingChecked, this.formWTW.countrySelectValue, this.formWTW.withFriend, this.formWTW.usePlex).subscribe(response => {
        // load existing data regarding this movie for the current user
        this.loadingWindow.dismiss();
        var id = response.id;
        if (id) this.navCtrl.push(MoviePage, { id: id });
        else {
          this.noResults = true;
        }
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.notValidReleaseDates = true;
    }
  }

  clickTVSearch() {
    if (this.formTVWTW.minRelease <= this.formTVWTW.maxRelease && this.formTVWTW.maxRelease <= new Date().getFullYear()) {
      this.loadingWindow = this.loading.create();
      this.loadingWindow.present();
      this.movieDBService.wtwTV(this.lang, this.formTVWTW.genreSelectValue, this.formTVWTW.isWatchlistChecked, this.formTVWTW.isRuntimeChecked, this.formTVWTW.runtimeLimit, this.formTVWTW.minRelease, this.formTVWTW.maxRelease, this.formTVWTW.countrySelectValue, this.formTVWTW.withFriend, this.formTVWTW.usePlex).subscribe(response => {
        // load existing data regarding this movie for the current user
        this.loadingWindow.dismiss();
        var id = response.id;
        if (id) this.navCtrl.push(TvShowPage, { id: id });
        else {
          this.noTVResults = true;
        }
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.notValidTVReleaseDates = true;
    }
  }

  ionViewWillEnter() {
    this.parentSubject.next('reload');
  }

}
