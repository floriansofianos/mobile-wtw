import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SignUpPage } from '../sign-up/sign-up';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = { email: '', password: '' };
  loadingWindow: Loading;
  isLoading: boolean;
  showSendWelcomeEmail: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private auth: AuthServiceProvider, private alertCtrl: AlertController, private statusBar: StatusBar,
    private loadingCtrl: LoadingController) {
    this.isLoading = true;
    this.loadingWindow = this.loadingCtrl.create();
    this.loadingWindow.present();
    this.auth.getAuthToken().then(token => {
      if (token) {
        this.putUserInMemoryAndRedirect();
      }
      else {
        this.isLoading = false;
        this.loadingWindow.dismiss();
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
        this.auth.setUserInSession(token.token);
        this.putUserInMemoryAndRedirect();
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

}
