import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild
} from "@angular/core";

import { debounceTime, switchMap, takeUntil, skip } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-mdz-autocomplete-container",
  templateUrl: "./mdz-autocomplete-container.component.html",
  styleUrls: ["./mdz-autocomplete-container.component.scss"]
})
export class MdzAutocompleteContainerComponent implements OnInit {
  private term: string = null;

  @Input()
  options: any;

  @Output()
  selectionChange: EventEmitter<any> = new EventEmitter();
  public timeout: any;
  public data = [];

  public term$ = new Subject<string>();

  public results$ = this.term$.pipe(
    this.autocomplete(200, term => {
      this.term = term;
      return this.fetch(term);
    })
  );

  private containerHeight = 0;

  @ViewChild("myElement") element: ElementRef;

  constructor(public http: HttpClient) {
    this.results$.subscribe(data => {
      this.data = this.getResult(data);
      if (!this.containerHeight && this.data.length !== 0) {
        this.setHeightOfScrollContainer();
      }
    });
    this.term$.next("");
  }

  ngOnInit() {
    console.log(this.options);
  }
  public template = "listView";
  public getResult(obj) {
    return obj.results;
  }

  public onKeyup(event) {
    this.term$.next(event.target.value);
  }

  public clickSelection(obj) {
    this.selectionChange.emit(obj);
  }

  private setHeightOfScrollContainer() {
    this.timeout = setTimeout(() => {
      if (this.element) {
        this.element.nativeElement.parentElement.addEventListener(
          "scroll",
          this.scrollTrigger.bind(this)
        );
        if (this.element.nativeElement.children[0]) {
          this.containerHeight =
            this.options.scrollHeight *
              this.element.nativeElement.children[0].clientHeight +
            this.options.scrollHeight +
            1;
        }
      }
    });
  }

  private scrollTrigger(e) {
    const a = e.currentTarget;
    if (
      Math.ceil(a.scrollTop) + a.clientHeight >= a.scrollHeight &&
      a.scrollTop !== 0
    ) {
      this.fetch(this.term)
        .pipe()
        .subscribe(data => {
          this.data = this.data.concat(this.getResult(data));
        });
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
    return this.http.get("https://swapi.co/api/people/?search=" + term);
  }
}
