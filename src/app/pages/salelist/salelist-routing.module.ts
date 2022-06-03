import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalelistPage } from './salelist.page';

const routes: Routes = [
  {
    path: '',
    component: SalelistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalelistPageRoutingModule {}
