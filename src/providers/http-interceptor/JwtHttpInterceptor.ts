import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { fromPromise } from 'rxjs/observable/fromPromise';


@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
constructor(private storage: Storage) { }

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return fromPromise(this.storage.get("token"))
    .switchMap(token => {
        if(token) {
            var reqClone = req.clone({ headers: req.headers.set('Authorization', 'JWT ' + token) });
            return next.handle(reqClone);
        }
        return next.handle(req);
   });
   //return next.handle(req);
}
}