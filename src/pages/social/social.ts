import { Component } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SocialServiceProvider } from '../../providers/social-service/social-service';
import { UserPage } from '../user/user';
import { Subject } from 'rxjs';

@Component({
  selector: 'page-social',
  templateUrl: 'social.html',
})
export class SocialPage {

  username: string;
  search: string;
  isLoading: boolean;
  noResults: boolean;
  usersThatAlsoLiked: any;
  currentUser: any;
  lang: any;
  loadingWindow: Loading;
  parentSubject:Subject<any> = new Subject();

  constructor(private authService: AuthServiceProvider, private socialService: SocialServiceProvider, private navCtrl: NavController, private loading: LoadingController) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.lang = this.currentUser.lang;
  }

  clickSearch() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.socialService.search(this.search).subscribe(data => {
      if (data) {
        data = data;
        if (data.success != undefined) {
          this.loadingWindow.dismiss();
          this.noResults = true;
        }
        else this.navCtrl.push(UserPage, { id: data.id });
      }
      else console.log('error!');
    },
      error => {
        console.log(error);
      }
    );
  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      // Enter pressed
      this.clickSearch();
    }
  }

  ionViewWillEnter() {
    this.parentSubject.next('reload');
  }

}
