import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = { email: '', password: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, private alertCtrl: AlertController) {
    this.auth.getAuthToken().then(token => { 
      if(token) {
        this.navCtrl.setRoot(HomePage);
      } 
    });
  }

  login() {
    this.auth.loginUser(this.credentials).subscribe(token => {
      if (token) {
        this.auth.setUserInSession(token.token);        
        this.navCtrl.setRoot(HomePage);
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
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

}
