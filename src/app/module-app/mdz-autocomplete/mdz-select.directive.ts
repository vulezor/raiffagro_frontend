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
} from "@angular/core";
import { Renderer2 } from "@angular/core";
import { MdzAutocompleteContainerComponent } from "./mdz-autocomplete-container/mdz-autocomplete-container.component";
import { MdzAutocompleteOptions } from "./interfaces";
import { NG_VALIDATORS, FormControl } from "@angular/forms";

@Directive({
  selector: "[appMdzSelect]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MdzSelectDirective,
      multi: true,
    },
  ],
})
export class MdzSelectDirective implements OnInit {
  private multiselect = false;
  private elem: HTMLElement;
  public componentRef: ComponentRef<any>;
  private value: any;

  @Input("appMdzSelect") option: MdzAutocompleteOptions;

  constructor(
    public elementRef: ElementRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private render: Renderer2
  ) {
    this.render.addClass(
      this.elementRef.nativeElement,
      "hide-auto-complete-original-input"
    );
  }

  ngOnInit() {
    this.elem = this.generateAutoCompleteElement();
    this.extendOption(this.elem);

    this.render.listen(this.elem, "click", (e: any) => {
      if (!this.componentRef) {
        this.importComponent();
      } else {
        this.deleteComponent();
      }
    });

    this.render.listen(this.elem, "mousedown", (e: any) => {
      e.stopPropagation();
    });
  }

  // validate({ value }: FormControl) {
  //   const isNotValid = this.answer !== Number(value);
  //   return (
  //     isNotValid && {
  //       invalid: true
  //     }
  //   );
  // }

  private generateAutoCompleteElement(): HTMLElement {
    const elem: HTMLElement = this.render.createElement("div"),
      elemAddOn: HTMLElement = this.render.createElement("div");

    this.value = this.render.createText(String.fromCharCode(160));

    this.addClass(elem, [
      "mdz-autocomplete",
      "form-control",
      "form-control-sm",
    ]);

    this.addClass(elemAddOn, "mdz-autocomplete-arrow");

    this.render.appendChild(elem, this.value);
    this.render.appendChild(elem, elemAddOn);
    this.render.insertBefore(
      this.elementRef.nativeElement.parentNode,
      elem,
      this.elementRef.nativeElement
    );
    return elem;
  }

  /**
   * @param elem imported html element
   * @description extend this.option object
   */
  private extendOption(elem: HTMLElement): void {
    Object.assign(this.option, {
      top: elem.offsetTop + elem.offsetHeight,
      left: elem.offsetLeft,
      height: this.option.height ? this.option.height : elem.offsetHeight,
      width: this.option.width ? this.option.width : elem.offsetWidth,
    });
  }

  public selectionChange(obj) {
    console.log("radi", obj, "radi");
  }

  private importComponent() {
    this.componentRef = this.resolver
      .resolveComponentFactory(MdzAutocompleteContainerComponent)
      .create(this.injector);

    this.componentRef.instance.options = this.option;

    this.componentRef.instance.selectionChange.subscribe((obj) => {
      this.render.removeChild(this.elem, this.value);
      if (this.multiselect) {
      } else {
        this.value = this.render.createText(obj.name);
      }
      this.render.appendChild(this.elem, this.value);
      this.deleteComponent();
    });

    // 1. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.componentRef.hostView);

    // 2. Get DOM element from component
    const domElem: HTMLElement = (this.componentRef.hostView as EmbeddedViewRef<
      any
    >).rootNodes[0] as HTMLElement;

    // 4. On do DOM element attach event on mouse down.
    domElem.onmousedown = (e) => {
      e.stopPropagation();
    };

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);

    // 5. Add event listener mousedown on to delete component
    document.addEventListener("mousedown", this.deleteComponent.bind(this));
  }

  /**
   * @description component from document
   */
  private deleteComponent() {
    if (this.componentRef) {
      document.removeEventListener(
        "mousedown",
        this.deleteComponent.bind(this)
      );
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  /**
   * @param elem any
   * @param val string
   * @description add class name or names to html element
   */
  private addClass(elem: HTMLElement, val: string | string[]) {
    if (val instanceof Array) {
      val.forEach((item) => {
        this.render.addClass(elem, item);
      });
    } else {
      this.render.addClass(elem, val);
    }
  }
}
