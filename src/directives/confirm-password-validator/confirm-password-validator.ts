import { Directive } from '@angular/core';
import { Validator, FormGroup, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateConfirmPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ConfirmPasswordValidatorDirective, multi: true }]
})
export class ConfirmPasswordValidatorDirective {

  validate(formGroup: FormGroup): { [key: string]: any } {
    let passwordControl = formGroup.controls['password'];
    let confirmPasswordControl = formGroup.controls['confirmPassword'];

    if ((passwordControl && passwordControl.value)
      && (confirmPasswordControl && confirmPasswordControl.value)
      && confirmPasswordControl.value === passwordControl.value) {
      return null;
    } else {
      return { validateConfirmPassword: false }
    }
  }

}
