import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginApiService } from 'app/api/login-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TokenData, User } from '@mdz/models';
import { TokenStorageService } from '@mdz/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginApiService]
})
export class LoginComponent implements OnInit, OnDestroy {
  public formGroup = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required]
  });
  constructor(private loginService: LoginApiService, private fb: FormBuilder) {}

  public loginOnSubmit() {
    this.loginService
      .login(this.formGroup.getRawValue())
      .pipe(untilDestroyed(this))
      .subscribe((data: { user: User; token_data: TokenData }) => {
        TokenStorageService;
        // localStorage.setItem(
        //   'Authentification',
        //   JSON.stringify(data.token_data)
        // ); // console.log(user)
        // localStorage.setItem('UserInfo', JSON.stringify(data.user)); // console.log(user)
      });
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
