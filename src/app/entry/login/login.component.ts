import { Component, OnInit } from '@angular/core';
import { LoginApiService } from 'app/api/login-api.service';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginApiService]
})
export class LoginComponent implements OnInit {
  public formGroup = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required]
  });
  constructor(private loginService: LoginApiService, private fb: FormBuilder) {}

  public loginOnSubmit() {
    this.loginService
      .login(this.formGroup.getRawValue())
      .subscribe(user => console.log(user));
  }

  ngOnInit() {}
}
