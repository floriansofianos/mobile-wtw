import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Storage } from '@ionic/storage';

import * as _ from 'underscore';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  baseUrl = 'https://app.whatowatch.net/';
  currentUser: any;

  constructor(public http: HttpClient, private storage: Storage) {
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/token', 'email=' + credentials.email + '&password=' + credentials.password, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .catch(this.handleErrors);
  }

  setUserInSession(token: string) {
    return this.storage.set('token', token);
  }

  getAuthToken() {
    return this.storage.get("token");
  }

  setCurrentUserInMemory(user) {
    this.currentUser = user;
  }

  getCurrentUserFromApi() {
    return this.http.get(this.baseUrl + 'auth/current')
      .catch(this.handleErrors);
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  logout(): any {
    this.storage.remove("token");
    this.currentUser = null;
  }

  verifyUsername(username: string): Observable<any> {
    return this.http.get(this.baseUrl + 'auth/checkUsername?username=' + username)
      .catch(this.handleErrors);
  }

  signUp(newUserForm: any): Observable<any> {
    newUserForm.password = newUserForm.passwordGroup.password;
    return this.http.post(this.baseUrl + 'auth/signup', newUserForm)
      .catch(this.handleSignUpErrors);
  }

  handleSignUpErrors(error: Response) {
    return Observable.throw(error.text());
  }

  setUserProperty(prop: string, value: any) {
    this.currentUser[prop] = value;
    let requestBody = {}
    requestBody[prop] = value
    return this.http.put(this.baseUrl + 'auth/current', requestBody)
      .catch(this.handleErrors);
  }

  setUserProperties(values: any) {
    let currentUser = this.currentUser;
    _.each(values, function (value, key, obj) { currentUser[key] = value; });
    return this.http.put(this.baseUrl + 'auth/current', values)
      .catch(this.handleErrors);
  }

  verifyEmail(email: string): Observable<any> {
    return this.http.get(this.baseUrl + 'auth/checkEmail?email=' + email)
      .catch(this.handleErrors);
  }

  sendWelcomeEmail(email: string): Observable<any> {
    return this.http.get(this.baseUrl + 'auth/sendWelcomeEmail', { params: { email: email } })
      .catch(this.handleErrors);
  }

  sendForgotPasswordEmail(email: string): Observable<any> {
    return this.http.get(this.baseUrl + 'auth/forgotPassword', { params: { email: email } })
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error.status);
  }

}
