import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inner-component',
  templateUrl: './inner-component.component.html',
  styleUrls: ['./inner-component.component.css']
})
export class InnerComponentComponent implements OnInit {

  message: string;

  constructor() { }

  ngOnInit(): void {
  }

  processMessage() {
    this.message = this.message.toUpperCase();
  }
}
