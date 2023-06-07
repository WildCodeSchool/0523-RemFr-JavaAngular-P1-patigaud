import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoPageComponent } from './pages/demo/demo.component';


import {FirstPageComponent} from './pages/first/first.page.component';
import {HomePageComponent} from './pages/home/home.page.component';
import {UserPageComponent} from './pages/user/user.page.component';
import {PotidexPageComponent} from './pages/potidex/potidex.page.component';
import {BadgePageComponent} from './pages/badge/badge.page.component';

const routes: Routes = [
  { 
    path: '', component: DemoPageComponent
  },
  { 
    path: 'first', component: FirstPageComponent
  },
  { 
    path: 'home', component: HomePageComponent
  },
  { 
    path: 'user', component: UserPageComponent 
  },
  { 
    path: 'potidex', component: PotidexPageComponent 
  },
  { 
    path: 'badge', component: BadgePageComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
