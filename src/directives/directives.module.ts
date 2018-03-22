import { NgModule } from '@angular/core';
import { EmailValidatorDirective } from './email-validator/email-validator';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ConfirmPasswordValidatorDirective } from './confirm-password-validator/confirm-password-validator';
import { PasswordValidatorDirective } from './password-validator/password-validator';
import { UsernameValidatorDirective } from './username-validator/username-validator';

@NgModule({
	declarations: [EmailValidatorDirective,
    ConfirmPasswordValidatorDirective,
    PasswordValidatorDirective,
    UsernameValidatorDirective],
	imports: [],
	exports: [EmailValidatorDirective,
    ConfirmPasswordValidatorDirective,
    PasswordValidatorDirective,
    UsernameValidatorDirective],
	providers: [
		AuthServiceProvider
	]
})
export class DirectivesModule {}
