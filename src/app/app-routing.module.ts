import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { TestlocComponent } from './components/testloc/testloc.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'geoloc', component: TestlocComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
