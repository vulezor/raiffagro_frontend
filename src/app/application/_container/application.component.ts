import { Component, OnInit } from '@angular/core';
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
import {
  faHandPointLeft,
  faHandPointRight
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-application',
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          'min-width': '180px',
          'max-width': '180px',
          width: '180px'
        })
      ),
      state(
        'closed',
        style({
          'min-width': '50px',
          'max-width': '50px',
          width: '50px'
        })
      ),
      transition('open => closed', [animate('0.05s ease-out')]),
      transition('closed => open', [animate('0.05s ease-in')])
    ])
  ],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  public faHandPointLeft = faHandPointLeft;
  public fixed = false;
  public isOpen = true;

  ngOnInit() {
    // this.authService.getV
  }

  public toggle() {
    this.isOpen = !this.isOpen;
  }
}
