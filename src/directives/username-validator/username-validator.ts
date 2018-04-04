import { Directive } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Directive({
  selector: '[validateUsername]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true }]
})
export class UsernameValidatorDirective {

  constructor(private authService: AuthServiceProvider) { }

    validate(formControl: FormControl) {
        return new Promise(resolve => {
            if (formControl && formControl.value) {
                this.authService.verifyUsername(formControl.value).subscribe(response => {
                    if (!response.isTaken) return resolve(null);
                    else return resolve({ validateUsername: true });
                },
                    error => {
                        return resolve({ validateUsername: true });
                    });
            } else {
                return resolve({ validateUsername: true });
            }
        });
    }

}
