import { ErrorHandler, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import Raven from 'raven-js';

Raven  
    .config('https://978449e2be2c4b2bb867b58bd84e1987@sentry.io/1091826')
    .install();

export class WtwErrorHandlerProvider implements ErrorHandler {
  constructor(
    @Inject(AlertController) private alerts: AlertController,
    @Inject(SplashScreen) public splashScreen: SplashScreen
  ) {}

  async handleError(error) {
    try {
      Raven.captureException(error.originalError || error);
    }
    catch(e) {
      console.error(e);
    }
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

