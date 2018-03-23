import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  loadingWindow: Loading;
  showForgotPasswordEmailSent: boolean;
  showForgotPasswordError: boolean;
  forgotPasswordForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController, private authService: AuthServiceProvider) {
  }

  forgotPassword(formValues: any) {
    this.loadingWindow = this.loadingCtrl.create();
    this.loadingWindow.present();
    this.authService.sendForgotPasswordEmail(formValues.email).subscribe(response => {
      this.loadingWindow.dismiss();
      this.showForgotPasswordEmailSent = true;
    },
      error => {
        this.showForgotPasswordError = true;
        this.loadingWindow.dismiss();
      });
  }

  cancel() {
    this.navCtrl.pop();
  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
        // Enter pressed
        this.forgotPassword(this.forgotPasswordForm.value);
    }
}

}
