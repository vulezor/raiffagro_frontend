import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpInterceptor,
  HttpEvent
} from '@angular/common/http';
import { NEVER, Observable, ReplaySubject, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor, OnDestroy {
  constructor() {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(request);
    return next.handle(request);
  }

  ngOnDestroy() {}
}
