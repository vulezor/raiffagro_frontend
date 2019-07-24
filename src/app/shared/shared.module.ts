import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
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
} from "ngx-bootstrap";

const MODULES = [
  CommonModule,
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
  CommonModule
];
const EXPORTMODULES = [
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
];
@NgModule({
  declarations: [],
  imports: [...MODULES],
  exports: [...EXPORTMODULES],
  providers: [],
  entryComponents: []
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
