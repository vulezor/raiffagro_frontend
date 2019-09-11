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
import { NEVER, Observable, ReplaySubject, throwError } from 'rxjs';
import { TokenStorageService } from '../core/services/token-storage.service';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor, OnDestroy {
  constructor(private tokens: TokenStorageService) {}

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

  ngOnDestroy() {}
}
