import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdzSelectDirective } from './mdz-select.directive';
import { MdzAutocompleteContainerComponent } from './mdz-autocomplete-container/mdz-autocomplete-container.component';

const DIRECTIVES = [MdzSelectDirective];

const COMPONENTS = [MdzAutocompleteContainerComponent];
@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
  entryComponents: [MdzAutocompleteContainerComponent]
})
export class MdzAutocompleteModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdzAutocompleteModule,
      providers: []
    };
  }
}
