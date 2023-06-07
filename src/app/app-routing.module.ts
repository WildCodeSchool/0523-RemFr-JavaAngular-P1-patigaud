import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoPageComponent } from './pages/demo/demo.component';
import { TestlocComponent } from './components/testloc/testloc.component';

const routes: Routes = [
  { path: '', component: DemoPageComponent },
  { path: 'geoloc', component: TestlocComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
