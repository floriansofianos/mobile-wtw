import { WtwErrorHandlerProvider } from '../providers/wtw-error-handler/wtw-error-handler';  
import Raven from 'raven-js';

Raven  
    .config('https://978449e2be2c4b2bb867b58bd84e1987@sentry.io/1091826')
    .install();

export class SentryErrorHandler extends WtwErrorHandlerProvider {

    handleError(error) {
        super.handleError(error);

        try {
          Raven.captureException(error.originalError || error);
        }
        catch(e) {
          console.error(e);
        }
    }
}