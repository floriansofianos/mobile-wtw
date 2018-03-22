import { Directive } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

/**
 * Generated class for the PasswordValidatorDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[validatePassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }]
})
export class PasswordValidatorDirective {

  validate(formControl: FormControl): { [key: string]: any } {
    if (formControl && formControl.value
      && formControl.value.length > 7) {
      return null;
    } else {
      return { validatePassword: false }
    }
  }

}
