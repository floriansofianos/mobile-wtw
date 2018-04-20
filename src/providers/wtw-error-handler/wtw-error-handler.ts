import { ErrorHandler, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

export class WtwErrorHandlerProvider implements ErrorHandler {
  constructor(
    @Inject(AlertController) private alerts: AlertController,
    @Inject(SplashScreen) public splashScreen: SplashScreen
  ) {}

  async handleError(error) {
    const alert = this.alerts.create({
      title: 'An Error Has Occurred',
      subTitle: 'Unfortunately, the app needs to be restarted',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Restart',
          handler: () => {
            this.splashScreen.show();
            window.location.reload();
          }
        }
      ]
    });
    alert.present();
  }
}

