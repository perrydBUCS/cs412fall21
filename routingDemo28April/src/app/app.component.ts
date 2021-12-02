import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // todo make this a specific type
  names: any[] = [
    {name: 'Bob', dept: 'CS'},
    {name: 'Alice', dept: 'CHEM'},
    {name: 'Mary', dept: 'BIO'},
  ];

  title = 'routingDemo28April';
}
