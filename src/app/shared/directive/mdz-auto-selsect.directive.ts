import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  Directive,
  HostListener,
  Renderer,
  ElementRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef,
  ContentChild,
  OnInit,
  EmbeddedViewRef,
  Injector,
  ApplicationRef
} from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap, takeUntil, skip, tap } from 'rxjs/operators';
import { TestComponent } from '../components/test/test.component';
import { timeout } from 'q';
import { Renderer2 } from '@angular/core';
let componentDeleted;
@Directive({
  selector: '[appMdzAutoSelsect]'
})
export class MdzAutoSelsectDirective implements OnInit {
  // @ViewChild('container', { read: ViewContainerRef }) public container;
  private div: any;
  public term$ = new BehaviorSubject<string>('');
  public componentRef: ComponentRef<any>;

  @Input('appMdzAutoSelsect') option: any;

  constructor(
    public elementRef: ElementRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private render: Renderer2
  ) {
    this.render.addClass(
      this.elementRef.nativeElement,
      'hide-auto-complete-original-input'
    );
  }

  ngOnInit() {
    this.div = this.generateAutoCompleteElement();
    Object.assign(this.option, {
      top: this.div.offsetTop + this.div.offsetHeight,
      left: this.div.offsetLeft,
      height: this.div.offsetHeight,
      width: this.div.offsetWidth
    });
    this.render.listen(this.div, 'click', (e: any) => {
      console.log('this.componentRef', this.componentRef);
      if (!this.componentRef) {
        this.importComponent();
      } else {
        this.deleteComponent();
      }
    });
    this.render.listen(this.div, 'mousedown', (e: any) => {
      e.stopPropagation();
    });
  }

  private generateAutoCompleteElement() {
    const div = this.render.createElement('div'),
      divAddOn = this.render.createElement('div'),
      text = this.render.createText(String.fromCharCode(160)),
      parent = this.elementRef.nativeElement.parentNode;

    this.render.addClass(div, 'mdz-autocomplete');
    this.render.addClass(div, 'form-control');
    this.render.addClass(div, 'form-control-sm');
    this.render.addClass(divAddOn, 'mdz-autocomplete-arrow');

    this.render.appendChild(div, text);
    this.render.appendChild(div, divAddOn);

    parent.insertBefore(div, this.elementRef.nativeElement);
    return div;
  }

  private importComponent() {
    this.componentRef = this.resolver
      .resolveComponentFactory(TestComponent)
      .create(this.injector);
    this.componentRef.instance.options = this.option;
    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    domElem.onmousedown = e => {
      e.stopPropagation();
    };

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);

    componentDeleted = () => {
      this.deleteComponent();
    };

    document.addEventListener('mousedown', componentDeleted);
  }

  private prepareData(obj) {
    obj.results;
  }

  private deleteComponent() {
    if (this.componentRef) {
      document.removeEventListener('mousedown', componentDeleted);
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
