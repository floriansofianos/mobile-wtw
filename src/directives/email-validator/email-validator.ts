import { Directive } from '@angular/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormControl, NG_ASYNC_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateEmail]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }]
})
export class EmailValidatorDirective {

  constructor(private authService: AuthServiceProvider) { }

    validate(formControl: FormControl) {
        return new Promise(resolve => {
            if (formControl && formControl.value) {
                this.authService.verifyEmail(formControl.value).subscribe(response => {
                    if (!response.isTaken) return resolve(null);
                    else return resolve({ validateEmail: true });
                },
                    error => {
                        return resolve({ validateEmail: true });
                    });
            } else {
                return resolve({ validateEmail: true });
            }
        });
    }

}
