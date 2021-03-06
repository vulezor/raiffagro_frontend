import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./core/core.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { AuthService } from "@mdz/services";

const MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  HttpClientModule,
  CoreModule.forRoot(),
  SharedModule.forRoot(),
  ButtonsModule.forRoot()
];

@NgModule({
  declarations: [AppComponent],
  imports: [...MODULES],
  bootstrap: [AppComponent],
  providers: [
    AuthService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppModule {}
