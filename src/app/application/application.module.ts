import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './_container/application.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ApplicationModule {}