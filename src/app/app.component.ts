import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';

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

import { SideMenuSettings } from '../components/side-menu-content/models/side-menu-settings';
import { MenuOptionModel } from '../components/side-menu-content/models/menu-option-model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  // Settings for the SideMenuComponent
	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: false,
		subOptionIndentation: {
			md: '56px',
			ios: '64px',
			wp: '56px'
		}
};

// Options to show in the SideMenuComponent
public options: Array<MenuOptionModel>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private translate: TranslateService, private menuCtrl: MenuController) {
    this.translate.setDefaultLang('en');
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Initialize some options
      this.initializeOptions();
    });
  }

  private initializeOptions(): void {
		this.options = new Array<MenuOptionModel>();

		// Load simple menu options
		// ------------------------------------------
		this.options.push({
			iconName: 'home',
			displayName: 'Home',
			component: HomePage,
    });
    
    this.options.push({
			displayName: 'What to watch',
			component: WhatowatchPage,
		});

		// Load options with nested items (with icons)
		// -----------------------------------------------
		this.options.push({
			iconName: 'film',
			displayName: 'Movies',
			subItems: [
				{
					iconName: 'search',
					displayName: 'Search',
					component: MoviesPage
				},
				{
					iconName: 'help',
					displayName: 'Questionnaire',
					component: MoviesQuestionnairePage
				},
				{
					iconName: 'time',
					displayName: 'Watchlist',
					component: MoviesWatchlistPage
				}
			]
    });
    
    this.options.push({
			iconName: 'videocam',
			displayName: 'TV Shows',
			subItems: [
				{
					iconName: 'search',
					displayName: 'Search',
					component: TvPage
				},
				{
					iconName: 'help',
					displayName: 'Questionnaire',
					component: TvQuestionnairesPage
				},
				{
					iconName: 'time',
					displayName: 'Watchlist',
					component: TvWatchlistPage
				}
			]
    });
    
    this.options.push({
			iconName: 'contacts',
			displayName: 'Social',
			component: SocialPage,
    });

    this.options.push({
			iconName: 'log-out',
			displayName: 'Logout',
			custom: {
        isLogout: true
      }
    });
}

public selectOption(option: MenuOptionModel): void {
  this.menuCtrl.close().then(() => {
    if (option.custom && option.custom.isLogout) {
			console.log('You\'ve clicked the logout option!');
		}
    else {
      // Redirect to the selected page
      this.nav.setRoot(option.component || HomePage, { 'title': option.displayName });
    }
  });
}

}
