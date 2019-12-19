import {
  Input,
  Directive,
  ElementRef,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  EmbeddedViewRef,
  Injector,
  ApplicationRef
} from "@angular/core";
import { Renderer2 } from "@angular/core";
import { MdzAutocompleteContainerComponent } from "./mdz-autocomplete-container/mdz-autocomplete-container.component";
import { MdzAutocompleteOptions } from "./interfaces";

@Directive({
  selector: "[appMdzSelect]"
})
export class MdzSelectDirective implements OnInit {
  private multiselect = false;
  private div: any;
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
    this.div = this.generateAutoCompleteElement();
    this.extendOption(this.div);

    this.render.listen(this.div, "click", (e: any) => {
      if (!this.componentRef) {
        this.importComponent();
      } else {
        this.deleteComponent();
      }
    });
    this.render.listen(this.div, "mousedown", (e: any) => {
      e.stopPropagation();
    });
  }

  private generateAutoCompleteElement(): any {
    const div: any = this.render.createElement("div"),
      divAddOn: any = this.render.createElement("div");

    this.value = this.render.createText(String.fromCharCode(160));

    this.addClass(div, ["mdz-autocomplete", "form-control", "form-control-sm"]);
    this.addClass(divAddOn, "mdz-autocomplete-arrow");

    this.render.appendChild(div, this.value);
    this.render.appendChild(div, divAddOn);
    this.render.insertBefore(
      this.elementRef.nativeElement.parentNode,
      div,
      this.elementRef.nativeElement
    );
    return div;
  }

  /**
   *@description extend this.option object
   */
  private extendOption(div: any): void {
    Object.assign(this.option, {
      top: div.offsetTop + div.offsetHeight,
      left: div.offsetLeft,
      height: this.option.height ? this.option.height : div.offsetHeight,
      width: this.option.width ? this.option.width : div.offsetWidth
    });
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

  public selectionChange(obj) {
    console.log("radi", obj, "radi");
  }

  private importComponent() {
    this.componentRef = this.resolver
      .resolveComponentFactory(MdzAutocompleteContainerComponent)
      .create(this.injector);

    this.componentRef.instance.options = this.option;

    this.componentRef.instance.selectionChange.subscribe(obj => {
      console.log("U direktivi", obj);
      this.render.removeChild(this.div, this.value);
      if (this.multiselect) {
      } else {
        console.log("radi", obj, "radi");
        this.value = this.render.createText(obj.name);
      }

      this.render.appendChild(this.div, this.value);
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("mousedown", true, true);
      document.dispatchEvent(clickEvent);
    });

    // 1. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.componentRef.hostView);

    // 2. Get DOM element from component
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. On do DOM element attach event on mouse down.
    domElem.onmousedown = e => {
      e.stopPropagation();
    };

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);

    // 5. Add event listener mousedown on to delete component
    document.addEventListener("mousedown", this.deleteComponent.bind(this));
  }

  /**
   * @delete component from document
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
}
