import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';
import { TvQuestionnaireServiceProvider } from '../../providers/tv-questionnaire-service/tv-questionnaire-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TvUserQuestionnaireServiceProvider } from '../../providers/tv-user-questionnaire-service/tv-user-questionnaire-service';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'tv-questionnaire',
  templateUrl: 'tv-questionnaire.html'
})
export class TvQuestionnaireComponent {
  @Input() lang: any;
  @Input() config: any;

  movie: any;
  questionAnswered: number
  questionsToAnswer: number;
  previousMovies: any = [];
  movieQuestionnaireInit: any;
  welcomeMessage: boolean;
  movieQuestionnaire: any;
  movieIndex: number;
  yearOfBirth: number;
  countriesList: any;
  selectedCountry: any;
  states: string[] = ['active', null, null];
  age: number;
  loadingWindow: Loading;

  constructor(private tvQuestionnaireService: TvQuestionnaireServiceProvider,
    private userQuestionnaireService: TvUserQuestionnaireServiceProvider,
    private loading: LoadingController, private authService: AuthServiceProvider, private ref: ChangeDetectorRef,
  private navCtrl: NavController) {

  }

  ngOnInit() {
    let currentUser = this.authService.getCurrentUser();
    if (currentUser.yearOfBirth) this.yearOfBirth = currentUser.yearOfBirth;
    else this.yearOfBirth = 1980;
    if (currentUser.country) this.selectedCountry = currentUser.country;
    this.questionsToAnswer = 10;
    this.welcomeMessage = true;
    this.movieIndex = -1;
    this.questionAnswered = 0;
    this.getNextAgeStep();
  }

  getNextAgeStep() {
    this.questionAnswered++;
    this.showNextMovie();
  }

  movieQuestionnaireChange(data) {
    if (data.skipMovie) {
      this.movieSkip();
    }
    else this.movieQuestionnaire = data;
  }

  moviePrevious() {
    this.movie = null;
    this.ref.detectChanges();
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.movieIndex--;
    if (this.movieIndex < 0) {
      this.questionAnswered--;
      this.setStateActive(1);
    }
    else {
      this.movie = this.previousMovies[this.movieIndex].movie;
      this.movieQuestionnaireInit = this.previousMovies[this.movieIndex].movieQuestionnaire;
      if (!this.movieQuestionnaireInit.isSkipped) this.questionAnswered--;
    }
    this.loadingWindow.dismiss();
  }

  showNextMovie() {
    if (this.previousMovies && this.previousMovies[this.movieIndex + 1]) {
      this.movieIndex++;
      this.movie = this.previousMovies[this.movieIndex].movie;
      this.movieQuestionnaireInit = this.previousMovies[this.movieIndex].movieQuestionnaire;
      if (this.movieIndex === 0) this.setStateActive(2);
    }
    else {
      this.getMovieQuestionnaireFromUserQuestionnaire();
    }
  }

  getMovieQuestionnaireFromUserQuestionnaire() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.userQuestionnaireService.get(this.lang).subscribe(response => {
      this.loadingWindow.dismiss();
      if (response.reload) {
        this.getMovieQuestionnaireFromUserQuestionnaire();
      }
      else this.showMovieFromAPIResponse(response);
    },
      error => {
        console.log(error);
      });
  }

  showMovieFromAPIResponse(response) {
    this.movie = response;
    this.movieIndex++;
    if (this.movieIndex === 0) this.setStateActive(2);
    this.storePreviousMovie(true);
  }

  movieSkip() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.movieQuestionnaire.isSkipped = true;
    this.storePreviousMovie(false);
    this.movie = null;
    // Save data in DB
    if (this.movieQuestionnaire) this.tvQuestionnaireService.create(this.movieQuestionnaire).subscribe(response => {
      this.loadingWindow.dismiss();
      this.showNextMovie();
    },
      error => {
        console.log(error);
      });
  }

  storePreviousMovie(isFirstSave: boolean) {
    if (this.previousMovies[this.movieIndex]) {
      this.previousMovies[this.movieIndex] = {
        movie: this.movie,
        movieQuestionnaire: this.movieQuestionnaire
      }
    }
    else this.previousMovies.push({
      movie: this.movie,
      movieQuestionnaire: isFirstSave ? null : this.movieQuestionnaire
    });
  }

  movieConfirm() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.storePreviousMovie(false);
    this.movie = null;
    // Save data in DB
    if (this.movieQuestionnaire) this.tvQuestionnaireService.create(this.movieQuestionnaire).subscribe(response => {
      this.questionAnswered++;
      // Check if we need to show more movies
      if (this.questionAnswered >= this.questionsToAnswer) {
        this.loadingWindow.dismiss();
      }
      else {
        this.loadingWindow.dismiss();
        this.showNextMovie();
      }
    },
      error => {
        console.log(error);
      });

  }

  private setStateActive(i: number) {
    this.resetAllStates();
    this.states[i] = 'active';
  }

  resetAllStates() {
    this.states.forEach((o, i, a) => a[i] = null);
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}
