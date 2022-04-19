import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyplacesPage } from './myplaces.page';

const routes: Routes = [
  {
    path: '',
    component: MyplacesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyplacesPageRoutingModule {}
