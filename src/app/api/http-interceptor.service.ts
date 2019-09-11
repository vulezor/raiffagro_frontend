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
import { switchMap } from 'rxjs/operators';
import { TokenStorageService } from '../core/services/token-storage.service';
import { TokenInfo } from '@mdz/models';
import { TypeaheadOptions } from 'ngx-bootstrap';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor, OnDestroy {
  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(private tokens: TokenStorageService, private http: HttpClient) {}

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
      request.url.includes('/auth/token/refresh')
    ) {
      return next.handle(request);
    }

    return next.handle(this.setHeaders(request));
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
        .post<TokenInfo>(refreshUrl, `"${this.tokens.getRefreshToken()}"`, {
          headers
        })
        .pipe(data => {
          switchMap(data => {
            if (data) {
              this.tokenSubject.next(true);
              return next.handle(this.setHeaders(request));
            }
          });
        });
    }
  }

  ngOnDestroy() {}
}
