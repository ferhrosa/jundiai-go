import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';
import { VisitedComponent } from './visited/visited.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent
  },
  {
    path: 'visited',
    component: VisitedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
