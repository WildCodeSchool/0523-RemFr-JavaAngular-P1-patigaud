import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { DemoPageComponent } from './pages/demo/demo.component';
import { DemoComponent } from './components/demo/demo.component';
import { DemoPipe } from './pipes/demo.pipe';
import { DemoDirective } from './directives/demo.directive';
import { PatidexComponent } from './components/patidex/patidex.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FirstPageComponent } from './pages/first/first.page.component';
import { HomePageComponent } from './pages/home/home.page.component';
import { UserPageComponent } from './pages/user/user.page.component';
import { PatidexPageComponent } from './pages/patidex/patidex.page.component';
import { BadgePageComponent } from './pages/badge/badge.page.component';
import { MapComponent } from './components/map/map.component';
import { TestlocComponent } from './components/testloc/testloc.component';
import { GeolocSpoofComponent } from './components/geoloc-spoof/geoloc-spoof.component';


@NgModule({
  declarations: [
    AppComponent,
    DemoPageComponent,
    DemoComponent,
    DemoPipe,
    DemoDirective,
    PatidexComponent,
    NavBarComponent,
    FirstPageComponent,
    HomePageComponent,
    UserPageComponent,
    PatidexPageComponent,
    BadgePageComponent,
    MapComponent,
    TestlocComponent,
    GeolocSpoofComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
