import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Globalization } from '@ionic-native/globalization';

import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SignUpPage } from '../sign-up/sign-up';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = { email: '', password: '' };
  loadingWindow: Loading;
  isLoading: boolean;
  showSendWelcomeEmail: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events,
    private auth: AuthServiceProvider, private alertCtrl: AlertController, private statusBar: StatusBar,
    private loadingCtrl: LoadingController, private translate: TranslateService, private globalization: Globalization) {
    this.isLoading = true;
    this.loadingWindow = this.loadingCtrl.create();
    this.loadingWindow.present();
    this.auth.getAuthToken().then(token => {
      if (token) {
        this.putUserInMemoryAndRedirect();
      }
      else {
        this.globalization.getPreferredLanguage()
          .then(res => {
            this.isLoading = false;
            this.loadingWindow.dismiss();
            this.showError(res);
          })
          .catch(e => {
            this.translate.use('en');
            this.isLoading = false;
            this.loadingWindow.dismiss();
          });
      }
    });
    this.statusBar.styleLightContent();
    this.statusBar.backgroundColorByHexString('#2F3238');
  }

  login() {
    this.loadingWindow = this.loadingCtrl.create();
    this.loadingWindow.present();
    this.auth.loginUser(this.credentials).subscribe(token => {
      if (token) {
        this.auth.setUserInSession(token.token).then(c => {
          this.putUserInMemoryAndRedirect();
        });
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
        this.isLoading = false;
        this.loadingWindow.dismiss();
        if (error == 401) this.showError(error);
        else this.showSendWelcomeEmail = true;
      });
  }

  putUserInMemoryAndRedirect() {
    this.auth.getCurrentUserFromApi().subscribe(user => {
      this.auth.setCurrentUserInMemory(user);
      this.translate.use(user.lang);
      this.events.publish('lang:changed');
      this.isLoading = false;
      this.loadingWindow.dismiss();
      this.navCtrl.setRoot(HomePage);
    },
      error => {
        this.isLoading = false;
        this.loadingWindow.dismiss();
        this.showError(error);
      });
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  resendWelcomeEmail() {
    this.loadingWindow = this.loadingCtrl.create();
    this.loadingWindow.present();
    this.auth.sendWelcomeEmail(this.credentials.email).subscribe(response => {
      this.loadingWindow.dismiss();
      this.showSendWelcomeEmail = false;
    },
      error => {
        console.log(error);
      });
  }

  signUp() {
    this.navCtrl.setRoot(SignUpPage);
  }

  goToForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

}
