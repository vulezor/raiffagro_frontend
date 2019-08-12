import { Component, OnInit } from '@angular/core';
import { AuthService } from '@mdz/services';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
   // this.authService.getV
  }

}
