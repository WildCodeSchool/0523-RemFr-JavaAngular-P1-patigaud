import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {FirstPageComponent} from './pages/first/first.page.component';
import {HomePageComponent} from './pages/home/home.page.component';
import {UserPageComponent} from './pages/user/user.page.component';
import {PatidexPageComponent} from './pages/patidex/patidex.page.component';
import {BadgePageComponent} from './pages/badge/badge.page.component';
import {TestlocComponent} from './components/testloc/testloc.component';

const routes: Routes = [
  {
    path: 'first', component: FirstPageComponent
  },
  {
    path: '', component: HomePageComponent
  },
  {
    path: 'user', component: UserPageComponent
  },
  {
    path: 'patidex', component: PatidexPageComponent
  },
  {
    path: 'badge', component: BadgePageComponent
  },
  {
    path: 'geoloc', component: TestlocComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
