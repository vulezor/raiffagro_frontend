import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { text } from '@angular/core/src/render3';

import { debounceTime, switchMap, takeUntil, skip } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mdz-autocomplete-container',
  templateUrl: './mdz-autocomplete-container.component.html',
  styleUrls: ['./mdz-autocomplete-container.component.scss']
})
export class MdzAutocompleteContainerComponent implements OnInit {
  constructor(public http: HttpClient) {
    this.results$.subscribe(data => {
      this.data = this.getResult(data);
    });
    this.term$.next('');
  }

  @Input()
  options: any;

  @Output()
  selectionChange = new EventEmitter();

  public data = [];

  public term$ = new BehaviorSubject<string>(null);

  public results$ = this.term$.pipe(
    this.autocomplete(200, term => this.fetch(term))
  );

  public getResult(obj) {
    return obj.results;
  }

  ngOnInit() {
    console.log(this.options);
  }

  public onKeydown(event) {
    this.term$.next(event.target.value);
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
