import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';
import * as _ from 'underscore';
import { SocialServiceProvider } from '../../providers/social-service/social-service';
import { UserPage } from '../user/user';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  loadingWindow: Loading;
  notifications: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private loading: LoadingController, 
    private notificationService: NotificationServiceProvider, private socialService: SocialServiceProvider) {
  }

  ngOnInit() {
    this.updateNotifications();
  }

  updateNotifications() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.notificationService.get().subscribe(response => {
      let allNotifications = response;
      // Show the non-read ones first
      let unreadNotifications = _.filter(allNotifications, (n) => { return !n.read });
      this.notifications = unreadNotifications;
      this.notifications = this.notifications.concat(_.filter(allNotifications, (n) => { return n.read }));
      this.loadingWindow.dismiss();
    },
      error => {
        console.log(error);
      });
  }

  acceptFriend(userId: number, notificationId: number) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.socialService.acceptFriend(userId, notificationId).subscribe(data => {
      this.loadingWindow.dismiss();
      this.updateNotifications();
    },
      error => {
        console.log(error);
      });
  }

  refuseFriend(userId: number, notificationId: number) {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.socialService.refuseFriend(userId, notificationId).subscribe(data => {
      this.loadingWindow.dismiss();
      this.updateNotifications();
    },
      error => {
        console.log(error);
      });
  }

  getMonth(createdAt) {
    return (new Date(createdAt)).getMonth();
  }

  goToUser(id) {
    this.navCtrl.push(UserPage, {id: id});
  }

}
