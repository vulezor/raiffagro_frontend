import { Injectable } from '@angular/core';
import { LoginCredentials, User, TokenInfo, TokenData } from '@mdz/models';
import { ReplaySubject, Observable, of } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginApiService } from 'app/api/login-api.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable()
export class AuthService {
  public currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);

  constructor(
    private loginService: LoginApiService,
    private tokens: TokenStorageService
  ) {}

  public login(loginCredentials: LoginCredentials) {
    return this.loginService.login(loginCredentials).pipe(
      switchMap((loginData: { user: User; token_data: TokenData }) => {
        console.log('loginData', loginData);
        const tokenInfo = new TokenInfo();
        tokenInfo.authentificationToken = loginData.token_data.access_token;
        tokenInfo.refreshToken = loginData.token_data.refresh_token;
        this.tokens.updateTokens(tokenInfo);
        return this.getUser().pipe(switchMap(r => of(true)));
      }),
      catchError(e => {
        this.tokens.updateTokens(null);
        return of(false);
      })
    );
  }

  private getUser(): Observable<any> {
    const apiObserver = this.loginService.getCurrentUser();
    return apiObserver.pipe(tap(s => this.currentUser.next(s.data)));
  }

  // public refreshStatus(): Observable<any> {
  //   const status = this.loginService.getCurrentUser<User>();
  //   return status.pipe(
  //     tap((s => this.currentUser.next(s), err => console.log(err)))
  //   );
  // }
}
