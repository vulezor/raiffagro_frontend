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
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(private loginService: LoginApiService, private fb: FormBuilder) {}

  ngOnInit() {}
}
