import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-sign-up',
    templateUrl: 'sign-up.html',
})
export class SignUpPage {

    signupForm: FormGroup;
    passwordGroup: FormGroup;
    backendError: string;
    showSpinner: boolean;
    isSubmitted: boolean;

    constructor(private navCtrl: NavController, private authService: AuthServiceProvider, private translate: TranslateService, private alertCtrl: AlertController) { }

    ngOnInit(): void {
        this.passwordGroup = new FormGroup({
            password: new FormControl(),
            confirmPassword: new FormControl()
        })

        this.signupForm = new FormGroup({
            email: new FormControl(null, [Validators.required, CustomValidators.email]),
            passwordGroup: this.passwordGroup,
            username: new FormControl(null, Validators.required),
            firstName: new FormControl(),
            lastName: new FormControl()
        });
    }

    cancel() {
        this.navCtrl.setRoot(LoginPage);
    }

    signup(formValues: any) {
        this.isSubmitted = true;
        if (this.signupForm.valid) {
            this.showSpinner = true;
            formValues.lang = 'en';
            this.authService.signUp(formValues).subscribe(response => {
                // We do not want to login the user since he needs to click on the accept link in the email
                this.translate.get('SIGNUP.SUCCESS').subscribe(successString => {
                    this.translate.get('SIGNUP.EMAIL_VALIDATION').subscribe(emailValidationString => {
                        let alert = this.alertCtrl.create({
                            title: successString,
                            subTitle: emailValidationString,
                            buttons: ['OK']
                        });
                        alert.present().then(a => {
                            this.navCtrl.setRoot(LoginPage);
                        });
                    });
                });

            },
                error => {
                    this.backendError = error;
                    this.showSpinner = false;
                });
        }
    }

    isEmailInvalid(): boolean {
        return this.signupForm.controls.email.errors && this.signupForm.controls.email.errors.email && ((this.signupForm.controls.email.touched && this.signupForm.controls.email.dirty) || this.isSubmitted);
    }

    isEmailEmpty(): boolean {
        return this.signupForm.controls.email.errors && this.signupForm.controls.email.errors.required && ((this.signupForm.controls.email.touched && this.signupForm.controls.email.dirty) || this.isSubmitted);
    }

    isUsernameEmpty(): boolean {
        return this.signupForm.controls.username.errors && this.signupForm.controls.username.errors.required && ((this.signupForm.controls.username.touched && this.signupForm.controls.username.dirty) || this.isSubmitted);
    }

    isPasswordStrongEnough(): boolean {
        return ((this.passwordGroup.controls.password.touched && this.passwordGroup.controls.password.dirty) || this.isSubmitted) && this.passwordGroup.controls.password.errors != null;
    }

    isConfirmPasswordInvalid(): boolean {
        return ((this.passwordGroup.controls.password.touched && this.passwordGroup.controls.password.dirty && this.passwordGroup.controls.confirmPassword.touched && this.passwordGroup.controls.confirmPassword.dirty) || this.isSubmitted)
            && this.passwordGroup.errors != null;
    }

    isEmailTaken(): boolean {
        return this.signupForm.controls.email.errors && this.signupForm.controls.email.errors.validateEmail && ((this.signupForm.controls.email.touched && this.signupForm.controls.email.dirty) || this.isSubmitted);
    }

    isUsernameTaken(): boolean {
        return this.signupForm.controls.username.errors && this.signupForm.controls.username.errors.validateUsername && ((this.signupForm.controls.username.touched && this.signupForm.controls.username.dirty) || this.isSubmitted);
    }

    keyDownFunction(event) {
        if (event.keyCode == 13) {
            // Enter pressed
            this.signup(this.signupForm.value);
        }
    }

}
