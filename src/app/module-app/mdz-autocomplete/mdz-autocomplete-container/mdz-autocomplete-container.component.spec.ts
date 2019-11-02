import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdzAutocompleteContainerComponent } from './mdz-autocomplete-container.component';

describe('MdzAutocompleteContainerComponent', () => {
  let component: MdzAutocompleteContainerComponent;
  let fixture: ComponentFixture<MdzAutocompleteContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdzAutocompleteContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdzAutocompleteContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
