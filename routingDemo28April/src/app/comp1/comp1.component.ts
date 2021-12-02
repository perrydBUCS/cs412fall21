import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css']
})
export class Comp1Component implements OnInit {

  name: string;
  department: string;

  constructor(private active: ActivatedRoute) { }

  ngOnInit(): void {
this.active.params.subscribe(params => {
  this.name = params.name;
  this.department = params.department;
}); }


}
