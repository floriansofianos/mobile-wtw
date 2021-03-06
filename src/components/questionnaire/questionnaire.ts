import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MovieQuestionnaireServiceProvider } from '../../providers/movie-questionnaire-service/movie-questionnaire-service';
import { Loading, LoadingController, NavController, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { QuestionnaireServiceProvider } from '../../providers/questionnaire-service/questionnaire-service';
import { UserQuestionnaireServiceProvider } from '../../providers/user-questionnaire-service/user-questionnaire-service';
import { CountriesServiceProvider } from '../../providers/countries-service/countries-service';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'questionnaire',
  templateUrl: 'questionnaire.html'
})
export class QuestionnaireComponent {

  @Input() isFirstQuestionnaire: boolean;
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
  showNoResults: boolean;

  constructor(private translate: TranslateService, private firstQuestionnaireService: QuestionnaireServiceProvider,
    private movieQuestionnaireService: MovieQuestionnaireServiceProvider, private events: Events,
    private userQuestionnaireService: UserQuestionnaireServiceProvider,
    private countriesService: CountriesServiceProvider, private loading: LoadingController,
    private authService: AuthServiceProvider, private ref: ChangeDetectorRef,
    private navCtrl: NavController) {

  }

  ngOnInit() {
    let currentUser = this.authService.getCurrentUser();
    if (currentUser.yearOfBirth) this.yearOfBirth = currentUser.yearOfBirth;
    else this.yearOfBirth = 1980;
    if (currentUser.country) this.selectedCountry = currentUser.country;
    this.questionsToAnswer = this.isFirstQuestionnaire ? 12 : 10;
    this.welcomeMessage = true;
    this.movieIndex = -1;
    this.questionAnswered = 0;
    if (!this.lang) this.lang = this.translate.currentLang;
    if (currentUser.firstQuestionnaireCompleted && this.isFirstQuestionnaire) {
      this.questionAnswered = this.questionsToAnswer;
      this.setStateActive(2);
    }
    if (!this.isFirstQuestionnaire) {
      this.getNextAgeStep();
    }
  }



  welcomeMessageOK() {
    this.welcomeMessage = false;
  }

  setTranslation(lang: string) {
    this.translate.use(lang);
    this.events.publish('lang:changed');
    this.lang = lang;
  }

  isTranslation(lang: string) {
    return this.translate.currentLang === lang;
  }

  langSkip() {
    this.setStateActive(1);
    this.questionAnswered++;
  }

  ageSkip() {
    this.getNextAgeStep();
  }

  langConfirm() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    // Save data in DB
    this.authService.setUserProperty('lang', this.translate.currentLang).subscribe(response => {
      this.countriesService.getAll().subscribe(response => {
        this.countriesList = response.countries;
        this.setStateActive(1);
        this.loadingWindow.dismiss();
        this.questionAnswered++;
      },
        error => {
          throw new Error(error);
        });
    },
      error => {
        throw new Error(error);
      });
  }

  agePrevious() {
    this.setStateActive(0);
    this.questionAnswered--;
  }

  ageConfirm() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    // Save data in DB
    if (this.yearOfBirth) this.authService.setUserProperty('yearOfBirth', this.yearOfBirth).subscribe(response => {
      if (this.selectedCountry) this.authService.setUserProperty('country', this.selectedCountry).subscribe(response => {
        this.loadingWindow.dismiss();
        this.getNextAgeStep();
      },
        error => {
          throw new Error(error);
        });
      else {
        this.loadingWindow.dismiss();
        this.getNextAgeStep();
      }
    },
      error => {
        throw new Error(error);
      });
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
      if (this.isFirstQuestionnaire) {
        this.loadingWindow = this.loading.create();
        this.loadingWindow.present();
        this.firstQuestionnaireService.getFirstQuestionnaireMovie(this.lang).subscribe(response => {
          this.loadingWindow.dismiss();
          this.showMovieFromAPIResponse(response);
        },
          error => {
            throw new Error(error);
          });
      }
      else {
        this.getMovieQuestionnaireFromUserQuestionnaire();
      }
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
      else if (response.noResult) {
        this.showNoResults = true;
        //this.loadingWindow.dismiss();
      }
      else this.showMovieFromAPIResponse(response);
    },
      error => {
        throw new Error(error);
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
    if (this.movieQuestionnaire) this.movieQuestionnaireService.create(this.movieQuestionnaire).subscribe(response => {
      this.loadingWindow.dismiss();
      this.showNextMovie();
    },
      error => {
        throw new Error(error);
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
    if (this.movieQuestionnaire) this.movieQuestionnaireService.create(this.movieQuestionnaire).subscribe(response => {
      this.questionAnswered++;
      // Check if we need to show more movies
      if (this.questionAnswered >= this.questionsToAnswer) {
        if (this.isFirstQuestionnaire) {
          this.authService.setUserProperty('firstQuestionnaireCompleted', true).subscribe(response => {
            this.loadingWindow.dismiss();
          },
            error => {
              throw new Error(error);
            });
        }
        else {
          this.loadingWindow.dismiss();
        }
      }
      else {
        this.loadingWindow.dismiss();
        this.showNextMovie();
      }
    },
      error => {
        throw new Error(error);
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
