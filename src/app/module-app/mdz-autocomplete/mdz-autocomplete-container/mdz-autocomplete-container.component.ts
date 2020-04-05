import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";

import { debounceTime, switchMap, takeUntil, skip } from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-mdz-autocomplete-container",
  templateUrl: "./mdz-autocomplete-container.component.html",
  styleUrls: ["./mdz-autocomplete-container.component.scss"],
})
export class MdzAutocompleteContainerComponent implements OnInit {
  @Input()
  public options: any;

  @Output()
  public selectionChange: EventEmitter<any> = new EventEmitter();

  public timeout: any;

  public data = [];

  public term$ = new Subject<string>();

  public template = "listView"; //listView  gridView

  public results$ = this.term$.pipe(
    this.autocomplete(200, (term) => {
      this.term = term;
      this.page = 1;
      return this.fetch(term);
    })
  );

  private containerHeight = 0;

  private term: string = null;

  private page: number;

  private lastPage: number;

  private loadData: boolean = true;

  @ViewChild("myElement") element: ElementRef;

  constructor(public http: HttpClient) {
    this.results$.subscribe((data: any) => {
      if (this.element) {
        this.element.nativeElement.parentElement.scrollTop = 0;
      }
      this.data = data.data;
      this.lastPage = data.last_page;
      if (!this.containerHeight && data.data.length !== 0) {
        setTimeout(() => {
          this.setHeightOfScrollContainer();
        });
      }
    });
    this.term$.next("");
  }

  ngOnInit() {
    console.log(this.options);
  }

  public getResult(obj) {
    return obj.data;
  }

  public onKeyup(event) {
    this.term$.next(event.target.value);
  }

  public clickSelection(obj) {
    this.selectionChange.emit(obj);
  }

  private setHeightOfScrollContainer(): void {
    if (this.element) {
      this.element.nativeElement.parentElement.addEventListener(
        "scroll",
        this.scrollTrigger.bind(this)
      );
      if (this.element.nativeElement.children.length) {
        this.containerHeight =
          this.options.scrollHeight *
            this.element.nativeElement.children[0].clientHeight +
          this.options.scrollHeight +
          1;
      }
    }
  }

  private scrollTrigger(e) {
    const a = e.currentTarget;
    if (
      Math.ceil(a.scrollTop) + a.clientHeight >= a.scrollHeight &&
      a.scrollTop !== 0 &&
      this.loadData
    ) {
      if (this.lastPage > this.page) {
        this.page++;
        this.loadData = false;
        this.fetch(this.term)
          .pipe()
          .subscribe((data) => {
            this.data = this.data.concat(data.data);
            this.loadData = true;
          });
      }
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
    return this.http.post(
      "http://lara.loc/api/test_for_pagination?page=" + this.page,
      { per_page: this.options.perPage, term: term }
    );
  }
}
