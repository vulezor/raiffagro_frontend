import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route,
  CanLoad,
  UrlSegment
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "@mdz/services";
import { map, tap, switchMap } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  private isLoggedin: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedin = this.authService
      .tryAutoLogin()
      .pipe(switchMap(r => this.getLoggedInStatus()));
  }

  private getLoggedInStatus() {
    return this.authService.getCurrentUser().pipe(
      map(s => s != null),
      tap(s => {
        console.log(`logged in status of user ${s}`);
      })
    );
  }

  // inherit
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleLoginRedirect(state.url);
  }

  // inherit
  public canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = segments.map(segment => segment.path).join("/");
    return this.handleLoginRedirect(url);
  }

  private handleLoginRedirect(url: string): Observable<boolean> | boolean {
    return this.isLoggedin.pipe(
      tap(loggedIn => {
        if (!loggedIn) {
          this.authService.setRedirectUrl(url);
          this.router.navigate(["public/login"]);
        }
      })
    );
  }
}
