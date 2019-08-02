import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(inject([AuthService], (serv: AuthService) => {
    service = serv;
  }));
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
