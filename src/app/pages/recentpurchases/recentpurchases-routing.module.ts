import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentpurchasesPage } from './recentpurchases.page';

const routes: Routes = [
  {
    path: '',
    component: RecentpurchasesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentpurchasesPageRoutingModule {}
