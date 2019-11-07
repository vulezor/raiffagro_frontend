import {
  Input,
  Directive,
  ElementRef,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  EmbeddedViewRef,
  Injector,
  ApplicationRef,
  ɵConsole
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { MdzAutocompleteContainerComponent } from './mdz-autocomplete-container/mdz-autocomplete-container.component';

@Directive({
  selector: '[appMdzSelect]'
})
export class MdzSelectDirective implements OnInit {
  private multiselect = true;
  private div: any;
  // public term$ = new Subject<string>();
  public componentRef: ComponentRef<any>;
  private value: any;
  @Input('appMdzSelect') option: any;

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
    const div = this.createDivContainer(),
      divAddOn = this.addAddOn(),
      parent = this.elementRef.nativeElement.parentNode;
    this.value = this.createText(String.fromCharCode(160));
    this.addClass(div, ['mdz-autocomplete', 'form-control', 'form-control-sm']);
    this.render.appendChild(div, this.value);
    this.render.appendChild(div, divAddOn);
    parent.insertBefore(div, this.elementRef.nativeElement);
    return div;
  }

  private createDivContainer() {
    return this.render.createElement('div');
  }

  private createText(str: string) {
    return this.render.createText(str);
  }

  private addClass(elem, val: string | string[]) {
    if (val instanceof Array) {
      val.forEach(item => {
        this.render.addClass(elem, item);
      });
    } else {
      this.render.addClass(elem, val);
    }
  }

  private addAddOn() {
    const divAddOn = this.createDivContainer();
    this.addClass(divAddOn, 'mdz-autocomplete-arrow');
    return divAddOn;
  }

  public selectionChange(obj) {
    console.log('radi', obj, 'radi');
  }

  private importComponent() {
    this.componentRef = this.resolver
      .resolveComponentFactory(MdzAutocompleteContainerComponent)
      .create(this.injector);

    this.componentRef.instance.options = this.option;

    this.componentRef.instance.selectionChange.subscribe(obj => {
      this.render.removeChild(this.div, this.value);
      if (this.multiselect) {
      } else {
        this.value = this.createText(obj.name);
      }

      this.render.appendChild(this.div, this.value);
    });

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

    document.addEventListener('mousedown', this.deleteComponent.bind(this));
  }

  private deleteComponent() {
    if (this.componentRef) {
      document.removeEventListener(
        'mousedown',
        this.deleteComponent.bind(this)
      );
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
