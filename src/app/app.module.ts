import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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

import { TimelineComponent } from '../components/timeline/timeline';
import { SideMenuContentComponent } from '../components/side-menu-content/side-menu-content.component';

import { ComponentsModule } from '../components/components.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TimelineServiceProvider } from '../providers/timeline-service/timeline-service';
import { JwtHttpInterceptor } from '../providers/http-interceptor/JwtHttpInterceptor';
import { MovieDBServiceProvider } from '../providers/movie-db-service/movie-db-service';
import { UserServiceProvider } from '../providers/user-service/user-service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MoviesPage,
    LoginPage,
    MoviesWatchlistPage,
    MyProfilePage,
    TvWatchlistPage,
    SocialPage,
    WhatowatchPage,
    TvPage,
    TvQuestionnairesPage,
    MoviesQuestionnairePage,
    SideMenuContentComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    HttpClientModule,
    VirtualScrollModule,
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
    WhatowatchPage,
    MoviesWatchlistPage,
    MyProfilePage,
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
    UserServiceProvider
  ]
})
export class AppModule {}
