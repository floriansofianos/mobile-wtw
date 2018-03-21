import { NgModule } from '@angular/core';
import { EmailValidatorDirective } from './email-validator/email-validator';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@NgModule({
	declarations: [EmailValidatorDirective],
	imports: [],
	exports: [EmailValidatorDirective],
	providers: [
		AuthServiceProvider
	]
})
export class DirectivesModule {}
