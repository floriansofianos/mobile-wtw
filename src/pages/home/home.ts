import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { TimelineServiceProvider } from '../../providers/timeline-service/timeline-service';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirstQuestionnairePage } from '../first-questionnaire/first-questionnaire';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  config: any;
  timelineEvents: any;
  allFriends: any;
  lang: any;
  currentUserId: any;
  parentSubject: Subject<any> = new Subject();
  enableRefresh: boolean = true; 

  constructor(public navCtrl: NavController, private timelineService: TimelineServiceProvider, private statusBar: StatusBar,
    private loadingController: LoadingController, private movieDBService: MovieDBServiceProvider, private userService: UserServiceProvider,
    private auth: AuthServiceProvider) {
    this.statusBar.styleLightContent();
    this.statusBar.backgroundColorByHexString('#2F3238');

    this.lang = this.auth.getCurrentUser().lang;
    this.currentUserId = this.auth.getCurrentUser().id;

    if (!this.auth.getCurrentUser().firstQuestionnaireCompleted) this.navCtrl.setRoot(FirstQuestionnairePage);

    let loading = this.loadingController.create();
    loading.present();

    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.config = response;
      this.userService.getAllFriends().subscribe(response => {
        this.allFriends = response;
        this.timelineService.get(0).subscribe(data => {
          this.timelineEvents = data;
          loading.dismiss();
        },
          error => {
            throw new Error(error);
          });
      });
    });

  }

  onScroll(event: any) {
    this.enableRefresh = event.enableRefresh;
  }

  doRefresh(refresher) {
    this.timelineEvents = null;
    this.timelineService.get(0).subscribe(data => {
      this.timelineEvents = data;
      refresher.complete();
    },
      error => {
        throw new Error(error);
      });
  }

  ionViewWillEnter() {
    this.parentSubject.next('reload');
  }

}
