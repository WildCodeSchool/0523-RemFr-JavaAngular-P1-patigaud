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
import { FirstComponent } from './components/first/first.component';
import { MainComponent } from './components/main/main.component';
import { UserComponent } from './components/user/user.component';
import { PotidexComponent } from './components/potidex/potidex.component';
import { BadgeComponent } from './components/badge/badge.component';


@NgModule({
  declarations: [
    AppComponent,
    DemoPageComponent,
    DemoComponent,
    DemoPipe,
    DemoDirective,
    NavBarComponent,
    FirstComponent,
    MainComponent,
    UserComponent,
    PotidexComponent,
    BadgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
