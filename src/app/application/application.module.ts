import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './_container/application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import { SharedModule } from 'app/shared/shared.module';

const COMPONENTS = [ApplicationComponent];
const MODULES = [CommonModule, SharedModule];
const ROUTER = ApplicationRoutingModule;
const SERVICES = [];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES, ROUTER],
  providers: [SERVICES]
})
export class ApplicationModule {}
