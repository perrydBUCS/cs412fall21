import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Comp1Component} from './comp1/comp1.component';
import {Comp2Component} from './comp2/comp2.component';


const routes: Routes = [
  {path: 'detail/:name/:department', component: Comp1Component},
  {path: 'about', component: Comp2Component}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
