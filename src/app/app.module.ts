import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DemoPageComponent } from './pages/demo/demo.component';
import { DemoComponent } from './components/demo/demo.component';
import { DemoPipe } from './pipes/demo.pipe';
import { DemoDirective } from './directives/demo.directive';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FirstPageComponent } from './pages/first/first.page.component';
import { HomePageComponent } from './pages/home/home.page.component';
import { UserPageComponent } from './pages/user/user.page.component';
import { PatidexPageComponent } from './pages/patidex/patidex.page.component';
import { BadgePageComponent } from './pages/badge/badge.page.component';
import { MapComponent } from './components/map/map.component';




@NgModule({
  declarations: [
    AppComponent,
    DemoPageComponent,
    DemoComponent,
    DemoPipe,
    DemoDirective,
    NavBarComponent,
    FirstPageComponent,
    HomePageComponent,
    UserPageComponent,
    PatidexPageComponent,
    BadgePageComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
