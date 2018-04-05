import { Component, Input } from '@angular/core';
import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';

import * as _ from 'underscore';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { NotificationsPage } from '../../pages/notifications/notifications';
import { Subject } from 'rxjs';

@Component({
  selector: 'top-menu-notification',
  templateUrl: 'top-menu-notification.html'
})
export class TopMenuNotificationComponent {

  notificationCount: number;
  loadingWindow: Loading;
  @Input() parentSubject: Subject<any>;

  constructor(private notificationService: NotificationServiceProvider, private nav: NavController, private loading: LoadingController) { }

  ngOnInit() {
    this.parentSubject.subscribe(event => {
      this.updateNotificationsCount();
    });
    this.updateNotificationsCount();
  }

  updateNotificationsCount() {
    this.notificationService.get().subscribe(response => {
      let allNotifications = response;
      // Show the non-read ones first
      let unreadNotifications = _.filter(allNotifications, (n) => { return !n.read });
      this.notificationCount = _.size(unreadNotifications);
    },
      error => {
        throw new Error(error);
      });
  }

  goToNotifications() {
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    this.notificationService.readAllReadOnly().subscribe(response => {
      this.notificationCount -= response[0];
      this.loadingWindow.dismiss();
      this.nav.push(NotificationsPage);
    },
      error => {
        throw new Error(error);
      });

  }
}
