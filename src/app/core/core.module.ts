import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
  APP_INITIALIZER,
  ErrorHandler
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthService, HttpInterceptorService } from '@mdz/services';
import { LocalStorageService } from './services/local-storage.service';
import { TokenStorageService } from './services/token-storage.service';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
  // TranslateModule.forRoot({
  //   loader
  // });
];

const SERVICES = [
  AuthService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true,
    LocalStorageService
  }
];

@NgModule({
  imports: [...MODULES],
  declarations: [],
  exports: [TranslateModule],
  providers: [...SERVICES]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'Core Module is already loaded. Import in the App Module only'
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: AuthService, useClass: AuthService },
        { provide: TokenStorageService, useClass: TokenStorageService }
      ]
    };
  }
}
