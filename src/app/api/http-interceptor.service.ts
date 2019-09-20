import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpInterceptor,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import {
  NEVER,
  Observable,
  ReplaySubject,
  throwError,
  BehaviorSubject
} from 'rxjs';
import {
  switchMap,
  catchError,
  finalize,
  take,
  filter,
  delay,
  retry
} from 'rxjs/operators';
import { TokenStorageService } from '../core/services/token-storage.service';
import { TokenInfo } from '@mdz/models';
import { TypeaheadOptions } from 'ngx-bootstrap';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor, OnDestroy {
  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(
    private tokens: TokenStorageService,
    private router: Router,
    private http: HttpClient
  ) {}

  private setHeaders(request: HttpRequest<any>) {
    return (request = request.clone({
      setHeaders: {
        accept: 'application/json',
        Authorization: `Bearer ${this.tokens.getAuthentificationToken()}`
      }
    }));
  }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !request.url.includes('/api/') ||
      request.url.includes('/assets/') ||
      request.url.includes('/api/refresh_token')
    ) {
      return next.handle(request);
    }

    if (this.isRefreshingToken) {
      return this.handleExpiredAccessToken(request, next);
    } else {
      return next.handle(this.setHeaders(request)).pipe(
        catchError(
          (error: HttpErrorResponse): Observable<HttpEvent<any>> => {
            switch ((error as HttpErrorResponse).status) {
              case 401:
                return this.handleExpiredAccessToken(request, next);
              default:
                return this.handleErrorAndRetry(request, next, error);
            }
          }
        )
      );
    }
  }

  private handleExpiredAccessToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(false);

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const position = request.url.search('/api/');
      const baseUrl = request.url.substring(0, position);
      const refreshUrl = `${baseUrl}/api/refresh_token`;
      return this.http
        .post<any>(refreshUrl, `${this.tokens.getRefreshToken()}`, {
          headers
        })
        .pipe(
          switchMap(data => {
            if (data) {
              this.tokens.updateTokens({
                authentificationToken: data.access_token,
                refreshToken: data.refresh_token
              });
              this.tokenSubject.next(true);
              return next.handle(this.setHeaders(request));
            }
            this.navigateToLoginAndClearTokens();
          }),
          catchError(error => {
            return this.handleErrorAndRetry(request, next, error);
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      return this.tokenSubject.pipe(
        untilDestroyed(this),
        filter(token => token === true),
        take(1),
        switchMap(token => {
          return next.handle(this.setHeaders(request));
        })
      );
    }
  }

  public handleErrorAndRetry(
    request: HttpRequest<any>,
    next: HttpHandler,
    error: HttpErrorResponse
  ) {
    if (
      (error as HttpErrorResponse).status === 401 ||
      (error as HttpErrorResponse).status === 401 ||
      (error as HttpErrorResponse).status === 500 ||
      this.tokens.getRefreshToken() === null
    ) {
      this.navigateToLoginAndClearTokens();
      return throwError(error);
    }
    return next.handle(this.setHeaders(request)).pipe(
      delay(500),
      retry(2),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  private navigateToLoginAndClearTokens() {
    this.router.navigate(['public/login']).then(() => {
      this.tokens.clearTokens();
    });
  }

  ngOnDestroy() {}
}
