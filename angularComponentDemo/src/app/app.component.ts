import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<span class="important">{{ title }} app is running!</span>\n' +
    '    <app-inner-component></app-inner-component>\n',
  styles: ['.important {\n' +
  '  color: red;\n' +
  '}']
})
export class AppComponent {
  title = 'angularComponentDemo';
}
