import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginApiService } from 'app/api/login-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
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
      .subscribe(user => console.log(user));
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
