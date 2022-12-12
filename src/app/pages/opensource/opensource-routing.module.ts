import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpensourcePage } from './opensource.page';

const routes: Routes = [
  {
    path: '',
    component: OpensourcePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpensourcePageRoutingModule {}
