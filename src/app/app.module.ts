import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StarRatingModule } from 'angular-star-rating';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MoviesPage } from '../pages/movies/movies';
import { LoginPage } from '../pages/login/login';
import { MoviesQuestionnairePage } from '../pages/movies-questionnaire/movies-questionnaire';
import { MoviesWatchlistPage } from '../pages/movies-watchlist/movies-watchlist';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { SocialPage } from '../pages/social/social';
import { TvPage } from '../pages/tv/tv';
import { TvQuestionnairesPage } from '../pages/tv-questionnaires/tv-questionnaires';
import { TvWatchlistPage } from '../pages/tv-watchlist/tv-watchlist';
import { WhatowatchPage } from '../pages/whatowatch/whatowatch';
import { MoviePage } from '../pages/movie/movie';
import { CastPage } from '../pages/cast/cast'; 
import { TvShowPage } from '../pages/tv-show/tv-show';


import { TimelineComponent } from '../components/timeline/timeline';
import { SideMenuContentComponent } from '../components/side-menu-content/side-menu-content.component';
import { MovieRecommandationComponent } from '../components/movie-recommandation/movie-recommandation';
import { TvRecommandationComponent } from '../components/tv-recommandation/tv-recommandation';
import { CastMemberComponent } from '../components/cast-member/cast-member';
import { MovieWallComponent } from '../components/movie-wall/movie-wall';
import { MovieWallElementComponent } from '../components/movie-wall-element/movie-wall-element';
import { TVWallComponent } from '../components/tv-wall/tv-wall';
import { TVWallElementComponent } from '../components/tv-wall-element/tv-wall-element';
import { MovieQuestionnaireComponent } from '../components/movie-questionnaire/movie-questionnaire';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { TvQuestionnaireComponent } from '../components/tv-questionnaire/tv-questionnaire';
import { TvQuestionnaireElementComponent } from '../components/tv-questionnaire-element/tv-questionnaire-element';

import { ComponentsModule } from '../components/components.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TimelineServiceProvider } from '../providers/timeline-service/timeline-service';
import { JwtHttpInterceptor } from '../providers/http-interceptor/JwtHttpInterceptor';
import { MovieDBServiceProvider } from '../providers/movie-db-service/movie-db-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { MovieQuestionnaireServiceProvider } from '../providers/movie-questionnaire-service/movie-questionnaire-service';
import { MovieRecommandationServiceProvider } from '../providers/movie-recommandation-service/movie-recommandation-service';
import { TvQuestionnaireServiceProvider } from '../providers/tv-questionnaire-service/tv-questionnaire-service';
import { TvRecommandationServiceProvider } from '../providers/tv-recommandation-service/tv-recommandation-service';
import { QuestionnaireServiceProvider } from '../providers/questionnaire-service/questionnaire-service';
import { UserQuestionnaireServiceProvider } from '../providers/user-questionnaire-service/user-questionnaire-service';
import { CountriesServiceProvider } from '../providers/countries-service/countries-service';
import { TvUserQuestionnaireServiceProvider } from '../providers/tv-user-questionnaire-service/tv-user-questionnaire-service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MoviesPage,
    LoginPage,
    MoviePage,
    MoviesWatchlistPage,
    MyProfilePage,
    TvWatchlistPage,
    SocialPage,
    CastPage,
    CastMemberComponent,
    TvQuestionnaireComponent,
    WhatowatchPage,
    TvPage,
    TvShowPage,
    TvQuestionnairesPage,
    MoviesQuestionnairePage,
    SideMenuContentComponent,
    MovieRecommandationComponent,
    TvQuestionnaireElementComponent,
    MovieWallElementComponent,
    TvRecommandationComponent,
    MovieQuestionnaireComponent,
    QuestionnaireComponent,
    ProgressBarComponent,
    TVWallComponent,
    TVWallElementComponent,
    MovieWallComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    VirtualScrollModule,
    BrowserAnimationsModule,
    StarRatingModule,
    TooltipsModule,
    ComponentsModule,
    CommonModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MoviesPage,
    CastPage,
    WhatowatchPage,
    MoviesWatchlistPage,
    MyProfilePage,
    MoviePage,
    TvShowPage,
    TvWatchlistPage,
    TvQuestionnairesPage,
    SocialPage,
    TvPage,
    MoviesQuestionnairePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: JwtHttpInterceptor, 
      multi: true 
    }, 
    AuthServiceProvider,
    TimelineServiceProvider,
    MovieDBServiceProvider,
    TvRecommandationServiceProvider,
    UserServiceProvider,
    MovieQuestionnaireServiceProvider,
    MovieRecommandationServiceProvider,
    TvQuestionnaireServiceProvider,
    QuestionnaireServiceProvider,
    UserQuestionnaireServiceProvider,
    CountriesServiceProvider,
    TvUserQuestionnaireServiceProvider
  ]
})
export class AppModule {}
