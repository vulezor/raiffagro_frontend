import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route,
  CanLoad,
  UrlSegment
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@mdz/services';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  private isLoggedin: Observable<boolean>;
  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedin = this.authService
      .tryAutoLogin()
      .pipe(switchMap(r => this.getLoggedInStatus()));
  }

  private getLoggedInStatus() {
    return this.authService.currentUser().pipe(
      map(s => s != null),
      tap(s => {
        console.log(`logged in status of user ${s}`);
      })
    );
  }
  public canActivate() {}

  public canLoad() {}
}
