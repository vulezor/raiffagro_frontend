import { Component, OnInit } from '@angular/core';

import { setTheme } from 'ngx-bootstrap/utils';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(public router: Router) {
    setTheme('bs4'); // or 'bs4'
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd, untilDestroyed(this)))
      .subscribe(e => console.log(e));
  }
}
