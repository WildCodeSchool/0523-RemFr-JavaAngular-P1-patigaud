import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoPageComponent } from './pages/demo/demo.component';


import {FirstComponent} from './components/first/first.component'
import {MainComponent} from './components/main/main.component'
import {UserComponent} from './components/user/user.component'
import {PotidexComponent} from './components/potidex/potidex.component'
import {BadgeComponent} from './components/badge/badge.component'

const routes: Routes = [
  { 
    path: '', component: DemoPageComponent
  },
  { 
    path: 'first', component: FirstComponent
  },
  { 
    path: 'main', component: MainComponent
  },
  { 
    path: 'user', component: UserComponent 
  },
  { 
    path: 'potidex', component: PotidexComponent 
  },
  { 
    path: 'badge', component: BadgeComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
