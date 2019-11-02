import { MdzSelectDirective } from './mdz-select.directive';
// import { Component, NgModule, ModuleWithProviders } from '@angular/Core';
import {
  ElementRef,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  Renderer2,
  Component,
  NgModule,
  ModuleWithProviders,
  Directive,
  Type
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MdzAutocompleteModule } from './mdz-autocomplete.module';
import { MdzAutocompleteContainerComponent } from './mdz-autocomplete-container/mdz-autocomplete-container.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';

export class MockElementRef extends ElementRef {}

describe('MdzSelectDirective', () => {
  let renderer2: Renderer2;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useClass: MdzAutocompleteContainerComponent },
        HttpClient,
        HttpHandler,
        Renderer2
      ],

      imports: [MdzAutocompleteModule]
    });
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(MdzAutocompleteContainerComponent);
    // grab the renderer
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<
      Renderer2
    >);
    // and spy on it
    spyOn(renderer2, 'addClass').and.callThrough();
    // or replace
    // spyOn(renderer2, 'addClass').and.callFake();
    // etc
  });

  it('should create an instance', () => {
    const directive = new MdzSelectDirective(
      TestBed.get(ElementRef),
      TestBed.get(ComponentFactoryResolver),
      TestBed.get(Injector),
      TestBed.get(ApplicationRef),
      TestBed.get(Renderer2)
    );
    expect(directive).toBeTruthy();
  });
});
