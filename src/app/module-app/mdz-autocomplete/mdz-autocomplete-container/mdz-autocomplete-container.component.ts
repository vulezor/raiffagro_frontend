import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ElementRef,
  ViewChild
} from '@angular/core';
import { text } from '@angular/core/src/render3';

import { debounceTime, switchMap, takeUntil, skip } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'q';

@Component({
  selector: 'app-mdz-autocomplete-container',
  templateUrl: './mdz-autocomplete-container.component.html',
  styleUrls: ['./mdz-autocomplete-container.component.scss']
})
export class MdzAutocompleteContainerComponent implements OnInit {
  constructor(public http: HttpClient, private render: Renderer2) {
    this.results$.subscribe(data => {
      this.data = this.getResult(data);
      if (!this.containerHeight && this.data.length !== 0) {
        this.setHeightOfscrollContainer();
      }
    });
    this.term$.next('');
  }
  private term: string = null;

  @Input()
  options: any;

  @Output()
  selectionChange = new EventEmitter();

  public data = [];

  public term$ = new BehaviorSubject<string>(null);

  public results$ = this.term$.pipe(
    this.autocomplete(200, term => {
      this.term = term;
      return this.fetch(term);
    })
  );

  private containerHeight = 0;

  @ViewChild('myElement') element: ElementRef;

  ngOnInit() {
    console.log(this.options);
  }

  public getResult(obj) {
    return obj.results;
  }

  public onKeyup(event) {
    this.term$.next(event.target.value);
  }

  public clickSelection() {}

  private setHeightOfscrollContainer() {
    setTimeout(() => {
      this.element.nativeElement.parentElement.addEventListener(
        'scroll',
        this.scrollTrigger.bind(this)
      );
      this.containerHeight =
        this.options.scrolHeight *
          this.element.nativeElement.children[0].clientHeight +
        this.options.scrolHeight +
        1;
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
          console.log(data);
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
    return this.http.get('https://swapi.co/api/people/?search=' + term);
  }
}
