import { Injectable } from "@angular/core";
import { LoginCredentials, User, TokenInfo, TokenData } from "@mdz/models";
import { ReplaySubject, Observable, of, BehaviorSubject } from "rxjs";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { LoginApiService } from "app/api/login-api.service";
import { untilDestroyed } from "ngx-take-until-destroy";
import { switchMap, catchError, tap, take } from "rxjs/operators";
import { TokenStorageService } from "./token-storage.service";
import { Router } from "@angular/router";
const DEFAULT_REDIRECT_URL = "/";
@Injectable()
export class AuthService {
  private currentUser: ReplaySubject<any> = new ReplaySubject<any>(1);

  private redirectUrl: BehaviorSubject<string> = new BehaviorSubject<string>(
    DEFAULT_REDIRECT_URL
  );
  constructor(
    private loginService: LoginApiService,
    private tokens: TokenStorageService,
    private router: Router
  ) {
    this.currentUser.next(null);
  }

  public login(loginCredentials: LoginCredentials) {
    return this.loginService.login(loginCredentials).pipe(
      switchMap((loginData: { user: User; token_data: TokenData }) => {
        const tokenInfo = new TokenInfo();
        tokenInfo.authentificationToken = loginData.token_data.access_token;
        tokenInfo.refreshToken = loginData.token_data.refresh_token;
        this.tokens.updateTokens(tokenInfo);

        return this.setUser().pipe(switchMap(r => of(true)));
      }),
      catchError(e => {
        this.tokens.updateTokens(null);
        return of(false);
      })
    );
  }

  public logout() {
    this.tokens.clearTokens();
    this.currentUser.next(null);
    this.router.navigate(["/public/login"]);
  }

  private setUser(): Observable<any> {
    const apiObserver = this.loginService.getCurrentUser();
    return apiObserver.pipe(tap(s => this.currentUser.next(s.data)));
  }

  public getCurrentUser(): Observable<any> {
    return this.currentUser.pipe(take(1));
  }

  public tryAutoLogin(): Observable<any> {
    if (
      this.tokens.getAuthentificationToken() &&
      this.tokens.getRefreshToken()
    ) {
      console.log("attemp auto-login");
      return this.setUser().pipe(switchMap(r => of(true)));
    }
    return of("");
  }

  public getRedirectUrl() {
    return this.redirectUrl.asObservable();
  }

  public setRedirectUrl(url: string) {
    this.redirectUrl.next(url);
  }

  public resetRedirectUrl() {
    this.redirectUrl.next(DEFAULT_REDIRECT_URL);
  }

  // public refreshStatus(): Observable<any> {
  //   const status = this.loginService.getCurrentUser<User>();
  //   return status.pipe(
  //     tap((s => this.currentUser.next(s), err => console.log(err)))
  //   );
  // }
}
