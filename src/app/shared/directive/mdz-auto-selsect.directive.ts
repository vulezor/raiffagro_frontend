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
  AfterContentInit,
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
let bla;
@Directive({
  selector: '[appMdzAutoSelsect]'
})
export class MdzAutoSelsectDirective implements OnInit, AfterContentInit {
  // @ViewChild('container', { read: ViewContainerRef }) public container;

  public term$ = new BehaviorSubject<string>('');
  public componentRef: ComponentRef<any>;
  public results$ = this.term$.pipe(
    this.autocomplete(200, term => this.fetch(term))
  );

  // @Input() filter:
  constructor(
    private httpClient: HttpClient,
    public elementRef: ElementRef,
    private resolver: ComponentFactoryResolver,
    private target: ViewContainerRef,
    private injector: Injector,
    private appRef: ApplicationRef,
    private render: Renderer2
  ) {
    // this.results$.subscribe(e => {
    //   if (!this.componentRef) {
    //      this.importComponent();
    //   }
    //    this.componentRef.instance.results = this.prepareData(e);
    // });
    // hide element in html sructure
    // this.render.addClass(
    //   this.elementRef.nativeElement,
    //   'hide-auto-complete-original-input'
    // );
  }

  ngOnInit() {
    const div = this.render.createElement('div');
    const text = this.render.createText(String.fromCharCode(160));
    const parent = this.elementRef.nativeElement.parentNode;
    this.render.addClass(div, 'mdz-autocomplete');
    this.render.addClass(div, 'form-control');
    this.render.addClass(div, 'form-control-sm');

    this.render.appendChild(div, text);
    parent.insertBefore(div, this.elementRef.nativeElement.nextSibling);
    this.render.listen(div, 'click', (e: any) => {
      console.log('this.componentRef', this.componentRef);
      if (!this.componentRef) {
        this.importComponent();
      }
    });
  }

  ngAfterContentInit() {}

  public importComponent() {
    this.componentRef = this.resolver
      .resolveComponentFactory(TestComponent)
      .create(this.injector);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);
    domElem.onmousedown = e => {
      e.stopPropagation();
      alert('kekere - mekere');
    };
    bla = () => {
      this.deleteComponent();
    };
    document.addEventListener('mousedown', bla);
  }

  private prepareData(obj) {
    obj.results;
  }

  @HostListener('keyup', ['$event'])
  inputChanged(event) {
    // this block is for
    this.term$.next(event.target.value);
    // console.log(this.elementRef.nativeElement.offsetLeft);
    // console.log(this.elementRef.nativeElement.offsetTop);
    // if (!this.componentRef) {
    //   const component = this.resolver.resolveComponentFactory(TestComponent);
    //   this.componentRef = this.target.createComponent(component);
    // }
    // setTimeout(() => {
    //   this.componentRef.instance.type = 'kekere mekere';
    // }, 3000);
    // this.deleteComponent();
  }

  private deleteComponent() {
    if (this.componentRef) {
      document.removeEventListener('mousedown', bla);
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }

  private autocomplete(time, selector) {
    return (source$: any) => {
      return source$.pipe(
        debounceTime(time),
        switchMap((...args: any[]) =>
          selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
        )
      );
    };
  }

  private fetch(term: string): Observable<any> {
    return this.httpClient.get('https://swapi.co/api/people/?search=' + term);
  }
}
