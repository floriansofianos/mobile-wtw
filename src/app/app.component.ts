import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

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

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { DonatePage } from '../pages/donate/donate';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = LoginPage;

	pages: Array<{ title: string, component: any }>;

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

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private translate: TranslateService, 
		private menuCtrl: MenuController, private auth: AuthServiceProvider, private events: Events) {
		this.translate.setDefaultLang('en');
		this.initializeApp();
		events.subscribe('lang:changed', () => {
			this.initializeOptions();
		});
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

		this.translate.get('TOP_MENU.HOME').subscribe(homeLabel => {
			this.translate.get('TOP_MENU.MOVIES').subscribe(moviesLabel => {
				this.translate.get('LEFT_MENU.SEARCH').subscribe(searchLabel => {
					this.translate.get('LEFT_MENU.QUESTIONNAIRE').subscribe(questionnaireLabel => {
						this.translate.get('LEFT_MENU.WATCHLIST').subscribe(watchlistLabel => {
							this.translate.get('TOP_MENU.TVSHOWS').subscribe(tvShowsLabel => {
								this.translate.get('TOP_MENU.SOCIAL').subscribe(socialLabel => {
									this.translate.get('TOP_MENU.USERPROFILE').subscribe(userProfileLabel => {
										this.translate.get('TOP_MENU.LOGOUT').subscribe(logoutLabel => {
											// Load simple menu options
											// ------------------------------------------
											this.options.push({
												iconName: 'home',
												displayName: homeLabel,
												component: HomePage,
											});

											this.options.push({
												iconName: 'film',
												displayName: 'What to watch',
												component: WhatowatchPage,
											});

											// Load options with nested items (with icons)
											// -----------------------------------------------
											this.options.push({
												displayName: moviesLabel,
												subItems: [
													{
														iconName: 'search',
														displayName: searchLabel,
														component: MoviesPage
													},
													{
														iconName: 'help',
														displayName: questionnaireLabel,
														component: MoviesQuestionnairePage
													},
													{
														iconName: 'time',
														displayName: watchlistLabel,
														component: MoviesWatchlistPage
													}
												]
											});

											this.options.push({
												displayName: tvShowsLabel,
												subItems: [
													{
														iconName: 'search',
														displayName: searchLabel,
														component: TvPage
													},
													{
														iconName: 'help',
														displayName: questionnaireLabel,
														component: TvQuestionnairesPage
													},
													{
														iconName: 'time',
														displayName: watchlistLabel,
														component: TvWatchlistPage
													}
												]
											});

											this.options.push({
												iconName: 'contacts',
												displayName: socialLabel,
												component: SocialPage,
											});

											this.options.push({
												iconName: 'person',
												displayName: userProfileLabel,
												component: MyProfilePage,
											});

											this.options.push({
												iconName: 'card',
												displayName: 'Donate',
												component: DonatePage,
											});

											this.options.push({
												iconName: 'log-out',
												displayName: logoutLabel,
												custom: {
													isLogout: true
												}
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	}

	public selectOption(option: MenuOptionModel): void {
		this.menuCtrl.close().then(() => {
			if (option.custom && option.custom.isLogout) {
				this.auth.logout();
				this.nav.setRoot(LoginPage);
			}
			else {
				// Redirect to the selected page
				this.nav.setRoot(option.component || HomePage, { 'title': option.displayName });
			}
		});
	}

}
