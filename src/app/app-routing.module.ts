import { NgModule, getPlatform } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {FirstPageComponent} from './pages/first/first.page.component';
import {HomePageComponent} from './pages/home/home.page.component';
import {UserPageComponent} from './pages/user/user.page.component';
import {PatidexPageComponent} from './pages/patidex/patidex.page.component';
import {BadgePageComponent} from './pages/badge/badge.page.component';
import {TestlocComponent} from './components/testloc/testloc.component';
import { GeolocSpoofComponent } from './components/geoloc-spoof/geoloc-spoof.component';

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
  },
  {
    path: 'spoof', component: GeolocSpoofComponent
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
