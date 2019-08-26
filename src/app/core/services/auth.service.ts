import { Injectable } from '@angular/core';
import { LoginCredentials, User } from '@mdz/models';
import { ReplaySubject, Observable } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginApiService } from 'app/api/login-api.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { switchMap } from 'rxjs/operators';
@Injectable()
export class AuthService {
  private currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);

  constructor(private loginService: LoginApiService) {}

  // public login(loginCredentials: LoginCredentials) {
  //   this.loginService
  //   .login(loginCredentials)
  //   .pipe(
  //     switchMap(t => {

  //     })
  //   )
  //   .subscribe(user => console.log(user));
  // }

  // public refreshStatus(): Observable<any> {
  //   const status = this
  // }
}
