import { Injectable } from "@angular/core";
import { LoginCredentials, User } from "@mdz/models";
import { ReplaySubject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
@Injectable()
export class AuthService {
  private currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);

  constructor() {}

  public login(loginCredentials: LoginCredentials) {}
}
