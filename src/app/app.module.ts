import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { TimelineComponent } from '../components/timeline/timeline';

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
    ListPage,
    LoginPage,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
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
    ListPage,
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
