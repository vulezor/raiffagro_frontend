import { Component, OnInit, Input } from '@angular/core';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  @Input()
  public text: string;

  @Input()
  public id: number;

  @Input()
  results: any;

  constructor() {}

  ngOnInit() {}
}
