import { Directive, HostListener } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap, takeUntil, skip } from 'rxjs/operators';

@Directive({
  selector: '[appMdzAutoSelsect]'
})
export class MdzAutoSelsectDirective {
  public term$ = new BehaviorSubject<string>('');
  public results$ = this.term$.pipe(
    this.autocomplete(200, term => this.fetch(term))
  );
  constructor(private httpClient: HttpClient) {
    console.log('auto complete directive is initiated');
    this.results$.subscribe(e => {
      console.log(e);
    });
  }
  @HostListener('keyup', ['$event'])
  inputChanged(event) {
    this.term$.next(event.target.value);
  }

  private autocomplete(time, selector) {
    return (source$: any) =>
      source$.pipe(
        debounceTime(time),
        switchMap((...args: any[]) =>
          selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
        )
      );
  }

  private fetch(term: string): Observable<any> {
    return this.httpClient.get('https://swapi.co/api/people/?search=' + term);
  }
}
