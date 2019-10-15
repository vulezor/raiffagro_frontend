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

  constructor(
    private httpClient: HttpClient,
    public elementRef: ElementRef,
    private resolver: ComponentFactoryResolver,
    private target: ViewContainerRef,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {
    this.results$.subscribe(e => {
      console.log('resolver', this.resolver);

      console.log(e);
    });
  }

  ngOnInit() {}

  ngAfterContentInit() {}

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
    this.deleteComponent();

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

    setTimeout(() => {
      this.componentRef.instance.type = new Date().getTime().toString();
    }, 2000);
  }

  private deleteComponent() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
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
