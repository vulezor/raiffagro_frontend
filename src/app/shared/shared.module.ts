import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {
  AccordionModule,
  AlertModule,
  ButtonsModule,
  CarouselModule,
  CollapseModule,
  BsDatepickerModule,
  BsDropdownModule,
  ModalModule,
  PaginationModule,
  PopoverModule,
  ProgressbarModule,
  RatingModule,
  SortableModule,
  TabsModule,
  TimepickerModule,
  TooltipModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import { LoginApiService } from 'app/api/login-api.service';
import { AuthGuard } from '@mdz/guards';
import { MainMenuComponent } from './components/layouts/main-menu/main-menu.component';
import { MdzAutocompleteModule } from 'app/module-app/mdz-autocomplete/mdz-autocomplete.module';

const COMPONENTS = [MainMenuComponent];
const MODULES = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  AccordionModule.forRoot(),
  AlertModule.forRoot(),
  ButtonsModule.forRoot(),
  CarouselModule.forRoot(),
  CollapseModule.forRoot(),
  BsDatepickerModule.forRoot(),
  BsDropdownModule.forRoot(),
  ModalModule.forRoot(),
  PaginationModule.forRoot(),
  PopoverModule.forRoot(),
  ProgressbarModule.forRoot(),
  RatingModule.forRoot(),
  SortableModule.forRoot(),
  TabsModule.forRoot(),
  TimepickerModule.forRoot(),
  TooltipModule.forRoot(),
  TypeaheadModule.forRoot(),
  MdzAutocompleteModule.forRoot(),
  AngularFontAwesomeModule,
  CommonModule
];
const EXPORTMODULES = [
  ReactiveFormsModule,
  FormsModule,
  AccordionModule,
  AlertModule,
  ButtonsModule,
  CarouselModule,
  CollapseModule,
  BsDatepickerModule,
  BsDropdownModule,
  ModalModule,
  PaginationModule,
  PopoverModule,
  ProgressbarModule,
  RatingModule,
  SortableModule,
  TabsModule,
  TimepickerModule,
  TooltipModule,
  TypeaheadModule,
  AngularFontAwesomeModule,
  MdzAutocompleteModule
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [...EXPORTMODULES],
  providers: []
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [LoginApiService, AuthGuard]
    };
  }
}
