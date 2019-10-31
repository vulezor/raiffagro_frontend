import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@mdz/services';
import { Router } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition
  // ...
} from '@angular/animations';
import { MdzAutoSelsectDirective } from 'app/shared/directive/mdz-auto-selsect.directive';

@Component({
  selector: 'app-application',
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          'min-width': '190px',
          'max-width': '190px'
        })
      ),
      state(
        'closed',
        style({
          'min-width': '40px',
          'max-width': '40px'
        })
      ),
      transition('open => closed', [animate('0.0s ease-out')]),
      transition('closed => open', [animate('0.0s ease-in')])
    ]),
    trigger('openCloseSideBar', [
      // ...
      state(
        'openSideBar',
        style({
          width: '190px'
        })
      ),
      state(
        'closedSideBar',
        style({
          width: '40px'
        })
      ),
      transition('openSideBar => closedSideBar', [animate('0.0s ease-out')]),
      transition('closedSideBar => openSideBar', [animate('0.0s ease-in')])
    ])
  ],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  @ViewChild(MdzAutoSelsectDirective) injectComp: MdzAutoSelsectDirective;

  public fixed = false;
  public isOpen = true;
  public selectorArray = [
    {
      url: 'https://swapi.co/api/people/?search=',
      filter: {
        additionalFilters: [],
        searchColumns: []
      },
      perPage: 2,
      direction: 'asc'
    },
    {
      url: 'https://swapi.co/api/people/?search=',
      filter: {
        additionalFilters: [],
        searchColumns: []
      },
      perPage: 2,
      direction: 'asc'
    }
  ];

  ngOnInit() {
    // this.authService.getV
  }
  public toggle() {
    this.isOpen = !this.isOpen;
  }
}
