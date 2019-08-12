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

  public getCurrentUser(){
    return this.http.get<User>(`${this.baseUrl}api/get_current_user`);
  }
}

interface LoginData {
  email: string;
  password: string;
}
