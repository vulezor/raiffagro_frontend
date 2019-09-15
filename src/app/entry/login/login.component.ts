import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginApiService } from 'app/api/login-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TokenData, User } from '@mdz/models';
import { AuthService } from '@mdz/services';
import { TokenStorageService } from 'app/core/services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginApiService, AuthService]
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
  ) {
    this.authService.getCurrentUser().subscribe(u => console.log(u));
  }

  public loginOnSubmit() {
    this.authService
      .login(this.formGroup.getRawValue())
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.authService
          .getRedirectUrl()
          .pipe(untilDestroyed(this))
          .subscribe((url: string) => {
            this.router.navigate([url]).then(() => {
              this.authService.resetRedirectUrl();
            });
          });
      });
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
