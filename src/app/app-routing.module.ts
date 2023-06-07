import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoPageComponent } from './pages/demo/demo.component';
import { PatidexComponent } from './components/patidex/patidex.component';

const routes: Routes = [
  { path: '', component: DemoPageComponent },
  { path: 'patidex', component: PatidexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
