import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@mdz/models';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LoginApiService {
  constructor(private http: HttpClient) {}
  public baseUrl = 'http://lara.loc/';

  public login(login: LoginData): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}api/login`, login);
  }
}

interface LoginData {
  email: string;
  password: string;
}
