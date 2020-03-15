import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoginApiService } from "app/api/login-api.service";
import { FormBuilder, Validators } from "@angular/forms";
import { untilDestroyed } from "ngx-take-until-destroy";
import { TokenData, User } from "@mdz/models";
import { AuthService } from "@mdz/services";
import { TokenStorageService } from "app/core/services/token-storage.service";
import { Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [LoginApiService]
})
export class LoginComponent implements OnInit, OnDestroy {
  public formGroup = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required]
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService
      .tryAutoLogin()
      .pipe(switchMap(u => this.getRedirection(u)))
      .subscribe(url => {
        if (url) {
          this.router.navigate([url]);
        }
      });
  }

  public loginOnSubmit() {
    this.authService
      .login(this.formGroup.getRawValue())
      .pipe(
        untilDestroyed(this),
        switchMap(data => this.getRedirection(data))
      )
      .subscribe((url: string) => {
        if (url) {
          this.router.navigate([url]);
        }
      });
  }

  private getRedirection(userData) {
    if (userData) {
      return this.authService.getRedirectUrl();
    } else {
      return of(null);
    }
  }

  ngOnDestroy() {}
}
